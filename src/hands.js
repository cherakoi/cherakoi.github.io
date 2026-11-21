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
    // GPU (WebGPU) delegate is several times faster than CPU where available; fall back to CPU.
    const options={
      runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:0.5,minTrackingConfidence:0.5
    };
    try {
      this.landmarker=await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:MODEL_URL,delegate:'GPU'},...options});
    } catch {
      this.landmarker=await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:MODEL_URL,delegate:'CPU'},...options});
    }
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

// MediaPipe labels map 1:1 to the subject on the user's live webcam (verified
// 2026-11-21 on hardware; the earlier photo-based swap produced inverted
// right/left, so it was removed). x is mirrored once, for the user-facing
// (mirrored) UI, not before inference. `skeleton` carries the full landmark
// sets so the UI can draw the hand skeletons on map and camera preview.
export function extractHands(result) {
  const hands={right:null,left:null,skeleton:{right:null,left:null}};
  if(!result||!Array.isArray(result.landmarks))return hands;
  for(let i=0;i<result.landmarks.length;i++) {
    const label=result.handednesses?.[i]?.[0]?.categoryName;
    if(label!=='Right' && label!=='Left') continue;
    const tip=result.landmarks[i]?.[8];
    if(!tip) continue;
    const point={x:1-tip.x,y:tip.y};
    if(point.x<0 || point.x>1 || point.y<0 || point.y>1) continue;
    if(label==='Right'){hands.right=point;hands.skeleton.right=result.landmarks[i];}
    else{hands.left=point;hands.skeleton.left=result.landmarks[i];}
  }
  return hands;
}

// Standard 21-landmark hand topology (MediaPipe HAND_CONNECTIONS).
export const HAND_CONNECTIONS=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];

// Draw a hand skeleton (bones + joints, index fingertip larger) into a 2-D
// context. `size` is the destination pixel box; `mirror=true` flips x for
// non-mirrored landmark coordinates (matches the mirrored preview and map).
export function drawHandSkeleton(ctx, landmarks, size, color, mirror = true) {
  if(!landmarks || landmarks.length<21) return;
  const px=lm=>(mirror?1-lm.x:lm.x)*size.width;
  const py=lm=>lm.y*size.height;
  ctx.save();
  ctx.lineWidth=2; ctx.strokeStyle=color; ctx.globalAlpha=0.5;
  ctx.beginPath();
  for(const [a,b] of HAND_CONNECTIONS){ ctx.moveTo(px(landmarks[a]),py(landmarks[a])); ctx.lineTo(px(landmarks[b]),py(landmarks[b])); }
  ctx.stroke();
  ctx.globalAlpha=0.85; ctx.fillStyle=color;
  for(const lm of landmarks){ ctx.beginPath(); ctx.arc(px(lm),py(lm),2.5,0,Math.PI*2); ctx.fill(); }
  const tip=landmarks[8];
  ctx.globalAlpha=1;
  ctx.beginPath(); ctx.arc(px(tip),py(tip),5,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
