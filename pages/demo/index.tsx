import React from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3 } from 'babylonjs';

export default function Demo() {
  const e = React.useRef(null);

  const baby = React.useCallback(() => {
    const canvas = document.createElement('canvas');
    document.getElementById('canvas').appendChild(canvas);
    canvas.style.height = '1000px';
    canvas.style.width = '2000px';
    const ctx = canvas.getContext('webgl2');
    const engine = new Engine(ctx, true);
    e.current = engine;
    const scene = new Scene(engine);

    MeshBuilder.CreateBox('box', {});

    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      15,
      new Vector3(0, 0, 0),
    );
    camera.attachControl(canvas, true);
    const light = new HemisphericLight('light', new Vector3(1, 1, 0), null);

    return scene;
  }, []);
  React.useEffect(() => {
    const scene = baby();
    e.current.runRenderLoop(function () {
      scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener('resize', function () {
      e.current.resize();
    });
  }, []);
  return (
    <div>
      <div id="canvas"></div>
    </div>
  );
}
