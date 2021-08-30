import { onMounted, onBeforeUnmount, reactive, computed } from "vue";

const DirectionConst = {
  UP: "UP",
  DOWN: "DOWN",
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  NONE: "NONE",
};

export default function useDetectSwipe(domElement: HTMLTableElement) {
  const touchStartCoord = reactive({ x: 0, y: 0 });
  const touchEndCoord = reactive({ x: 0, y: 0 });

  const diffX = computed(() => touchEndCoord.x - touchStartCoord.x);
  const diffY = computed(() => touchEndCoord.y - touchStartCoord.y);

  const distanceExceeded = computed(
    () => Math.max(Math.abs(diffX.value), Math.abs(diffY.value)) >= 60
  );

  const swipeDirection = computed(() => {
    if (!distanceExceeded.value) {
      return DirectionConst.NONE;
    }
    if (Math.abs(diffX.value) > Math.abs(diffY.value)) {
      return diffX.value < 0 ? DirectionConst.RIGHT : DirectionConst.LEFT;
    } else {
      return diffY.value < 0 ? DirectionConst.DOWN : DirectionConst.UP;
    }
  });

  const updateCoords = (coord: "start" | "end", x: number, y: number) => {
    switch (coord) {
      case "start":
        touchStartCoord.x = x;
        touchStartCoord.y = y;
        break;
      case "end":
        touchEndCoord.x = x;
        touchEndCoord.y = y;
        break;
    }
  };

  const listenerOptions = detectingPassiveEventSupport()
    ? { passive: true }
    : { capture: false };

  const touchStartListener = (e: TouchEvent) => {
    if (!listenerOptions.passive) {
      e.preventDefault();
    }
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    updateCoords("start", x, y);
    updateCoords("end", x, y);
  };

  const touchEndListener = (e: TouchEvent) => {
    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;
    updateCoords("end", x, y);
  };

  onMounted(() => {
    if (!domElement) {
      return;
    }
    domElement.addEventListener(
      "touchstart",
      touchStartListener,
      listenerOptions
    );

    domElement.addEventListener("touchend", touchEndListener, listenerOptions);
  });

  onBeforeUnmount(() => {
    if (!domElement) {
      return;
    }
    domElement.removeEventListener(
      "touchstart",
      touchStartListener,
      listenerOptions
    );

    domElement.removeEventListener(
      "touchend",
      touchEndListener,
      listenerOptions
    );
  });

  return { swipeDirection };
}

// Safely detecting option support
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

function detectingPassiveEventSupport() {
  let passiveSupported = false;

  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      },
    };

    window.addEventListener("touchstart", () => null, options);
    window.removeEventListener("touchstart", () => null);
  } catch (err) {
    passiveSupported = false;
  }
  return passiveSupported;
}
