import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

const createScene = async (
  engine: BABYLON.Engine,
  canvas: HTMLCanvasElement
): Promise<BABYLON.Scene> => {
  const scene = new BABYLON.Scene(engine);

  // 激活物理引擎
  // scene.enablePhysics();

  // 天空盒子环境
  const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 3000 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("src/assets/textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  // 加载角色模型
  const seagulf = (
    await BABYLON.SceneLoader.ImportMeshAsync("", "src/assets/models/", "seagulf.glb", scene)
  ).meshes[0];

  const avatar = (
    await BABYLON.SceneLoader.ImportMeshAsync("", "src/assets/models/", "avatar.glb", scene)
  ).meshes[0];

  // 调整角色大小、朝向和位置
  seagulf.scaling.scaleInPlace(0.2);
  seagulf.position = new BABYLON.Vector3(130, 100, -30);
  seagulf.rotation = new BABYLON.Vector3(0, 4.8, 0);

  avatar.scaling.scaleInPlace(200);
  avatar.position = new BABYLON.Vector3(120, 0, 70);
  avatar.rotation = new BABYLON.Vector3(0, 4.8, 0);

  // 创建自由视角相机
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,
    Math.PI / 3,
    1000,
    new BABYLON.Vector3(10, 10, 10),
    scene
  );

  // 设置相机位置到场景初始位置
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  // 添加环境光源
  const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0.8, 1, 0), scene);
  // 降低亮度
  light.intensity = 0.7;

  // 创建初始地板砖
  const faceColors = new Array(6);

  for (let i = 0; i < 6; i++) {
    if (i === 4) faceColors[i] = new BABYLON.Color4(0.13, 0.68, 1, 0.8);
    else faceColors[i] = new BABYLON.Color4(1, 1, 1, 1);
  }
  const tiledBox = BABYLON.MeshBuilder.CreateBox(
    "",
    {
      faceColors: faceColors,
      size: 500,
      height: 100,
    },
    scene
  );
  tiledBox.position = new BABYLON.Vector3(160, -50, 0);

  // 注册事件
  let duration: number;
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        parameter: " ",
      },
      () => {
        if (!duration) duration = new Date().getTime();
      }
    )
  );
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnKeyUpTrigger,
        parameter: " ",
      },
      () => {
        duration = new Date().getTime() - duration;
        console.log("按下时长：", duration / 1000);
        duration = 0;
      }
    )
  );
  // https://playground.babylonjs.com/#C21DGD#2
  // scene.onPointerDown = (e,res)=> {}

  // 返回最终渲染场景
  return scene;
};

export default async function initGames(canvas: HTMLCanvasElement) {
  let engine = new BABYLON.Engine(canvas, true);

  const scene = await createScene(engine, canvas);

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", function () {
    engine.resize();
  });
}
