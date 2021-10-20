export default class Animation {
  constructor(frame_set, delay) {
    this.count = 0;
    this.delay = delay;
    this.frame = 0;
    this.frame_index = 0;
    this.frame_set = frame_set;
  }

  change(frame_set, delay = 15) {
    if (this.frame_set != frame_set) {
      //if the frame set is different to currently stored
      this.count = 0;
      this.delay = delay;
      this.frame_index = 0;
      this.frame_set = frame_set; // setting the new array frameset
      this.frame = this.frame_set[this.frame_index];
    }
  }

  update(deltaTime) {
    this.count++;
    if (this.count >= this.delay) {
      // if the count goes past the delay set at 15 we change the frame
      this.count = 0;
      /* If the frame index is on the last value in the frame set, reset to 0.
        If the frame index is not on the last value, just add 1 to it. */
      this.frame_index =
        this.frame_index == this.frame_set.length - 1
          ? 0
          : this.frame_index + 1;
      this.frame = this.frame_set[this.frame_index]; // Change the current frame value.
    }
  }
}

//functional version

// const Animation = (frameSet, delay) => {
//   let count = 0;
//   let frame = 0;
//   let frameIndex = 0;

//   const change = (passedFrameSet, passedDelay = 15) => {
//     if (passedFrameSet != frameSet) {
//       count = 0;
//       delay = passedDelay;
//       frameIndex = 0;
//       frameSet = passedFrameSet;
//       frame = passedFrameSet[frameIndex];
//     }
//   };

//   const update = () => {
//     count++;
//     if (count > delay) {
//       //if the count goes past the delay set at 15 we change the frame
//       count = 0;
//       //if the frame index is on the last value in the frame set, reset to 0.
//       // if the frame index is not on the last value, just add 1 to it.
//       frameIndex = frameIndex == frameSet.length - 1 ? 0 : frameIndex + 1;
//       // change the current frame value
//       frame = frameSet[frameIndex];
//     }
//   };

//   return { change, update };
// };

// export default Animation;
