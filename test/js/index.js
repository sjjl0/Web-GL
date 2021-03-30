$(function(){
    /*场景构建*/
    var scene = new THREE.Scene();
    
    /*雾化效果：距离呈指数增长的雾化效果*/
    scene.fog = new THREE.FogExp2(0xffffff,0.01);

    /*两种投影方式构建+设置参数*/
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);//透视
    var camerax = new THREE.OrthographicCamera(window.innerWidth / -15, window.innerWidth / 15, window.innerHeight / 15, window.innerHeight / -15, 0.1, 1000);//正交
    
    /*渲染器*/
    var view = 1;
    var renderer = new THREE.WebGLRenderer();//渲染器构建
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth,window.innerHeight);

    /*坐标轴构建*/
    var axes = new THREE.AxisHelper(5);
    scene.add(axes);

    /*相机控件*/
    trackballControls = new THREE.TrackballControls(camera);//相机控制
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.0;
    trackballControls.panSpeed = 1.0;
    trackballControls.noZoom=false;
    trackballControls.noPan=false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    trackballControls.maxDistance = 100;
    trackballControls.minDistance = 10;
    trackballControlsx = new THREE.TrackballControls(camerax);
    trackballControlsx.rotateSpeed = 1.0;
    trackballControlsx.zoomSpeed = 1.0;
    trackballControlsx.panSpeed = 1.0;
    trackballControlsx.noZoom = false;
    trackballControlsx.noPan = false;
    trackballControlsx.staticMoving = true;
    trackballControlsx.dynamicDampingFactor = 0.3;

    /*背景纹理*/
    var loader = new THREE.TextureLoader();
    var bgtexture = loader.load("img/bg.jpg");
    scene.background = bgtexture;

    /*光源系统*/
    var spotLight = new THREE.SpotLight(0xcccccc);
    spotLight.angle = 0.5*Math.PI/3;//光源角
    spotLight.visible = true;//可见
    spotLight.position.set(0,0,50);//位置
    spotLight.castShadow = true;
    scene.add(spotLight);

    /*阴影系统*/
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.enable = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /*模型加载*/
    var modelA;
    var modelB;
    var modelC;//房子,g1,g2

   var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
        }
    };
    var onError = function(xhr) {};
    
    var objLoader1 = new THREE.OBJLoader();//颜色纹理，透明度0.5
        objLoader1.load('model/house/11.obj', function (object) {    
            var material = new THREE.MeshToonMaterial({color: 0xFFFFFF});
            material.transparent = true;//是否透明
            material.opacity = 0.5;//透明度
            object.children.forEach(function (child) {
                child.material = material;
                child.geometry.computeFaceNormals();
                child.geometry.computeVertexNormals();
            });

            object.position.set = (0,-15,0);
            object.rotation.y = 0.5;
            object.scale.set(0.5, 0.5, 0.5);
            object.castShadow = true;
            modelA = object;
            scene.add(object);
        }, onProgress, onError);
    
        var objLoader2 = new THREE.OBJLoader();//图片纹理
        objLoader2.load('model/g2/OK.obj', function (object) {
            var texture = new THREE.TextureLoader().load('img/01.jpg');
            var material = new THREE.MeshBasicMaterial( {map: texture} );
            object.children.forEach(function (child) {
                child.material = material;
                child.geometry.computeFaceNormals();
                child.geometry.computeVertexNormals();
            });

            object.position.set = (200,-15,200);
            object.rotation.y = 0.5;
            object.scale.set(0.1, 0.1, 0.1);
            object.castShadow = true;
            modelB = object;
            scene.add(object);
        }, onProgress, onError);

        var objLoader3 = new THREE.OBJLoader();//颜色纹理
        objLoader3.load('model/g1/1.obj', function (object) {
            var material = new THREE.MeshToonMaterial({color: 0x00FFFF});
            object.children.forEach(function (child) {
                child.material = material;
                child.geometry.computeFaceNormals();
                child.geometry.computeVertexNormals();
            });

            object.position.set = (0,0,0);
            object.rotation.y = 0.5;
            object.scale.set(0.5, 0.5, 0.5);
            object.castShadow = true;
            modelC = object;
            scene.add(object);
        }, onProgress, onError);

    /*地板*/
    var geometry = new THREE.PlaneGeometry(100,100,0,0);
    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0xFFFFFF}));
    mesh.receiveShadow = true;
    mesh.rotation.x = - Math.PI / 2;
    scene.add(mesh);

    /*渲染视图视角*/
    camera.position.x = -30;
    camera.position.y = 20;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    camerax.position.x = 10;
    camerax.position.y = 15;
    camerax.position.z = 70;
    camerax.lookAt(scene.position);
    $("#WebGL-output").append(renderer.domElement)
    renderScene();
    function renderScene() {
        renderer.setSize(window.innerWidth, window.innerHeight);//视区窗区变换
        var clock = new THREE.Clock();
           var delta = clock.getDelta();
           trackballControls.update(delta);
           trackballControlsx.update(delta);
           requestAnimationFrame(renderScene);
           if (view == 1) renderer.render(scene, camera);
           else renderer.render(scene, camerax);
    }

    /*操作*/
    var nowobj=0;
    var model;

    window.onkeydown = function (e) {
        let code = e.keyCode;
        switch (code) {
            /*切换模型*/
            case 90: 
                nowobj++;
                if(nowobj==3){
                    nowobj=0;
                }
                if(nowobj==0){
                    model=modelA;
                    document.getElementById("modelnow").innerText="房子";
                }
                if(nowobj==1){
                    model=modelB;
                    document.getElementById("modelnow").innerText="女孩1";
                }
                if(nowobj==2){
                    model=modelC;
                    document.getElementById("modelnow").innerText="女孩2";
                }
                break;

            /*空格重置*/
            case 32: 
                model.scale.set(0.1, 0.1, 0.1);
                trackballControls.maxDistance = 100;
                trackballControls.minDistance = 10;
                break;
            
            /*旋转模型*/
            case 87:
                model.rotateX(-1.5);
                break;
            case 83:    
                model.rotateX(1.5);
                break;
            case 65:    
                model.rotateY(-1.5);
                break;
            case 68:    
                model.rotateY(1.5);
                break;
            case 81:    
                model.rotateZ(-1.5);
                break;
            case 69:    
                model.rotateZ(1.5);
                break;

            /*切换投影方式*/
            case 80: 
                view = -view;
                break;

            /*改变俯仰角*/
            case 77:
                if (view == 1)
                {
                    trackballControls.maxDistance = trackballControls.maxDistance * 0.5;
                    trackballControls.minDistance = trackballControls.minDistance * 0.5;
                }
                break;
            case 78:
                if (view == 1)
                {
                    trackballControls.maxDistance = trackballControls.maxDistance * 2.0;
                    trackballControls.minDistance = trackballControls.minDistance * 2.0;
                }
                break;

            /*缩放模型*/
            case 74:       //X-放大
                model.scale.x = model.scale.x * 1.1;
                break;
            case 76:       //X-缩小
                model.scale.x = model.scale.x * 0.9;
                break;
            case 73:       //Y-放大
                model.scale.y =  model.scale.y * 1.1;
                break;
            case 75:       //Y-缩小
                model.scale.y =  model.scale.y * 0.9;
                break;
            case 85:       //Z-放大
                model.scale.z = model.scale.z * 1.1;
                break;
            case 79:       //Z-缩小
                model.scale.z = model.scale.z * 0.9;
                break;

            /*xoz平面移动*/
            case 37:
                model.position.x = model.position.x - 1;
                break;
            case 38:
                model.position.z = model.position.z + 1;
                break;
            case 39:
                model.position.x = model.position.x + 1;
                break;
            case 40:
                model.position.z = model.position.z - 1;
                break;

            /*y轴移动*/
            case 188:
                model.position.y = model.position.y - 1;
                break;
            case 190:
                model.position.y = model.position.y + 1;
                break;
        }
    }

})