// 0.10.22 does not exist on npm (0.10.x skips from 0.10.21 to 0.10.32): pinned to the nearest real 0.10.x.
const TASKS_BASE='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21';
const MODEL_URL='https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

/** Webcam model sees unmirrored frames; UI is mirrored separately. */
export class HandTracker {
  constructor(video, onFrame) {
    this.video=video;
    this.onFrame=onFrame;
    this.running=false;
    this.lastVideoTime=-1;
    this.lastInference=0;
    this.raf=null;
  }
  async start() {
    if(this.running) return;
    const {FilesetResolver,HandLandmarker}=await import(`${TASKS_BASE}/vision_bundle.mjs`);
    const vision=await FilesetResolver.forVisionTasks(`${TASKS_BASE}/wasm`);
    this.landmarker=await HandLandmarker.createFromOptions(vision,{
      baseOptions:{modelAssetPath:MODEL_URL,delegate:'CPU'},
      runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:0.5,minTrackingConfidence:0.5
    });
    try {
      this.stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'user',width:640,height:480}});
      this.video.srcObject=this.stream;
      await this.video.play();
      this.running=true;
      this.loop();
    } catch(error) {
      this.stop();
      throw error;
    }
  }
  loop=()=>{
    if(!this.running) return;
    const now=performance.now();
    if(this.video.readyState>=2 && this.video.currentTime!==this.lastVideoTime && now-this.lastInference>=65) {
      this.lastVideoTime=this.video.currentTime;
      this.lastInference=now;
      // detectForVideo is synchronous; cap frequency to avoid blocking UI too often.
      const result=this.landmarker.detectForVideo(this.video,now);
      this.onFrame(extractHands(result));
    }
    this.raf=requestAnimationFrame(this.loop);
  }
  stop() {
    this.running=false;
    if(this.raf!==null) cancelAnimationFrame(this.raf);
    this.raf=null;
    this.stream?.getTracks().forEach(track=>track.stop());
    this.stream=null;
    this.video.srcObject=null;
    this.landmarker?.close();
    this.landmarker=null;
    this.onFrame({right:null,left:null});
  }
}

// MediaPipe labels assume a MIRRORED (selfie) input; on our unmirrored webcam frames
// they are swapped, so the subject's right hand arrives as 'Left'. x is mirrored once,
// for the user-facing (mirrored) UI, not before inference.
export function extractHands(result) {
  const hands={right:null,left:null};
  for(let i=0;i<(result.landmarks?.length||0);i++) {
    const label=result.handednesses?.[i]?.[0]?.categoryName;
    if(label!=='Right' && label!=='Left') continue;
    const tip=result.landmarks[i]?.[8];
    if(!tip) continue;
    const point={x:1-tip.x,y:tip.y};
    if(point.x<0 || point.x>1 || point.y<0 || point.y>1) continue;
    if(label==='Left') hands.right=point;
    else hands.left=point;
  }
  return hands;
}
