var layer = document.querySelector(".layer");
var panoviewer = document.querySelector(".viewer");
var container = document.querySelector(".viewer .container");
var hotspots = Array.prototype.slice.call(document.querySelectorAll(".hotspot"));
var currentPage = "1";


var action_data = { IsBanetOpen: false ,IsleftDoorOpen : false,IsbacDoorOpen : false,IsrightDoorOpen : false}


function toRadian(deg) {
    return deg * Math.PI / 180;
}
function getHFov(fov) {
    var rect = container.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;
    return Math.atan(width / height * Math.tan(toRadian(fov) / 2)) / Math.PI * 360;
}
function rotate(point, deg) {
    var rad = toRadian(deg);
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);

    return [cos * point[0] - sin * point[1], sin * point[0] + cos * point[1]];
}
function setHotspotOffset(hotspot, viewer) {
    var oyaw = viewer.getYaw();
    var opitch = viewer.getPitch();
    var yaw = parseFloat(hotspot.getAttribute("data-yaw"));
    var pitch = parseFloat(hotspot.getAttribute("data-pitch"));
    var deltaYaw = yaw - oyaw;
    var deltaPitch = pitch - opitch;

    if (deltaYaw < -180) {
        deltaYaw += 360;
    } else if (deltaYaw > 180) {
        deltaYaw -= 360;
    }
    if (Math.abs(deltaYaw) > 90) {
        hotspot.style.transform = "translate(-200px, 0px)";
        return;
    }
    var radYaw = toRadian(deltaYaw);
    var radPitch = toRadian(deltaPitch);

    var fov = viewer.getFov();
    var hfov = getHFov(fov);

    var rx = Math.tan(toRadian(hfov) / 2);
    var ry = Math.tan(toRadian(fov) / 2);


    var point = [
        Math.tan(-radYaw) / rx,
        Math.tan(-radPitch) / ry,
    ];

    // Image rotation compensation
    // The original image is about 10 degrees tilted.
    point = point.map(function (p) {
        return p * Math.cos(15 / 180 * Math.PI);
    });
    point[1] = rotate(point, deltaYaw > 0 ? -10 : 10)[1];

    // point[0] /= 1.05;
    var left = viewer._width / 2 + point[0] * viewer._width / 2;
    var top = viewer._height / 2 + point[1] * viewer._height / 2;

    hotspot.style.transform = "translate(" + left + "px, " + top + "px) translate(-50%, -50%)";
}
function setHotspotOffsets(viewer) {
    hotspots.filter(function (hotspot) {
        return hotspot.getAttribute("data-page") === currentPage;
    }).forEach(function (hotspot) {
        setHotspotOffset(hotspot, viewer);
    });
}
function load(target, page) {
    if (currentPage == page) {
        return;
    }
    var yaw = target.getAttribute("data-yaw");
    var pitch = target.getAttribute("data-pitch");

    currentPage = "" + page;

    viewer.lookAt({
        yaw: yaw,
        pitch: pitch,
        fov: 30
    }, 500);
    
}
var viewer = new eg.view360.PanoViewer(container, {
    image: "https://gowthamr903.github.io/360View/images/front.JPG",
    projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
    yawRange: [-70,80], // horizontal FOV by degree is 270.
    pitchRange: [-55, 55], // vertical FOV by degree is 70.
    fovRange: [30, 70] // max fov should vertical FOV of the image. 70
    // useZoom: false,
    // projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.CUBEMAP,
    // cubemapConfig: {
    //     tileConfig: { flipHorizontal: true, rotation: 0 },
    // }
}).on("ready", function (e) {
    viewer.lookAt({
        fov: 80,
    });

    setTimeout(function () {
        viewer.lookAt({
            fov: 65,
        }, 500);
        setHotspotOffsets(viewer);
    });
}).on("viewChange", function (e) {
    setHotspotOffsets(viewer);
}).on("error", function (e) {
  console.error(e);
});

window.addEventListener("resize", function (e) {
    viewer.updateViewportDimensions();
    setHotspotOffsets(viewer);
});

PanoControls.init(panoviewer, viewer);
PanoControls.showLoading();



$('.link').hide();


    setTimeout(function () {
        $('#banet').show();
        $('#front_left_side').show();
        $('#front_right_side').show();
        
    }, 1000);


$( ".marker" ).click(function() {
   
var viewtype=$(this).attr("data-view");

$('.marker').hide();
$('.link').hide();

    switch(viewtype) {
        case "front":
        
            viewer.setImage("images/front.JPG", {
                 projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
            });

            $('#front_left_side').attr("data-yaw",45).attr("data-pitch",-20);
            $('#front_right_side').attr("data-yaw",-35).attr("data-pitch",-25)

            setTimeout(function () {
            $('#front_left_side').show('slow');
            $('#front_right_side').show('slow');
            $('#banet').show();
        }, 600);

          break;
          case "front_left_side":
        
            viewer.setImage("images/front_left_side.JPG", {
                 projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
            });

            $('#front').attr("data-yaw",-30).attr("data-pitch",-40);
            $('#left_side').attr("data-yaw",35).attr("data-pitch",-20);

              setTimeout(function () {
            $('#front').show('slow');
            $('#left_side').show('slow');
           }, 600);

          break;

          case "left_side":
        
            viewer.setImage("images/left_side.JPG", {
                 projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
            });

            $('#front_left_side').attr("data-yaw",-35).attr("data-pitch",-25);
            $('#back_left_side').attr("data-yaw",45).attr("data-pitch",-25);
            
            setTimeout(function () {

            $('#front_left_side').show('slow');
            $('#back_left_side').show('slow');
            $('#leftdoor').show();

        }, 600);

          break;

          case "back_left_side":
        
            viewer.setImage("images/back_left_side.JPG", {
                 projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
            });

            $('#left_side').attr("data-yaw",-35).attr("data-pitch",-25);
            $('#back').attr("data-yaw",45).attr("data-pitch",-20);

            setTimeout(function () {
            $('#left_side').show('slow');
            $('#back').show('slow');
        }, 600);

          break;

          case "back":
        
            viewer.setImage("images/back.JPG", {
                 projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
            });

            $('#back_left_side').attr("data-yaw",-35).attr("data-pitch",-25);
            $('#back_right_side').attr("data-yaw",45).attr("data-pitch",-30);
            setTimeout(function () {

            $('#back_left_side').show('slow');
            $('#back_right_side').show('slow');
            $('#backdoor').show();
        }, 600);
          break;

          case "back_right_side":
        
            viewer.setImage("images/back_right_side.JPG", {
                 projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
            });

            $('#back').attr("data-yaw",-35).attr("data-pitch",-25);
            $('#right_side').attr("data-yaw",35).attr("data-pitch",-20);

            setTimeout(function () {
            $('#back').show('slow');
            $('#right_side').show('slow');
        }, 600);
          break;

          case "right_side":
        
            viewer.setImage("images/right_side.JPG", {
                 projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
            });

            $('#back_right_side').attr("data-yaw",-35).attr("data-pitch",-25);
            $('#front_right_side').attr("data-yaw",45).attr("data-pitch",-20);
            
            setTimeout(function () {
            $('#back_right_side').show('slow');
            $('#front_right_side').show('slow');
            $('#rightdoor').show();
        }, 600);
        
          break;

          case "front_right_side":
        
            viewer.setImage("images/front_right_side.JPG", {
                 projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
            });
            $('#right_side').attr("data-yaw",-35).attr("data-pitch",-25);
            $('#front').attr("data-yaw",40).attr("data-pitch",-30);

            setTimeout(function () {
            $('#right_side').show('slow');
            $('#front').show('slow');
        }, 600);
          break;
        default:
          // code block
      }
  });



  function LoadAction(thisid, name){

    $('.marker').hide();
    $('.link').hide();

 if(name == "frontbanet" && action_data.IsBanetOpen == false){

    viewer.setImage("images/front_open.JPG", {
        projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
   });

   action_data.IsBanetOpen = true;

   setTimeout(function () {


   $('#banet').text("Close Banet").show();
}, 1000);

   $('#front_left_side').show();
  $('#front_right_side').show();

 }
 else  if(name == "frontbanet" && action_data.IsBanetOpen == true)
 {
    viewer.setImage("images/front.JPG", {
        projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
   });

   action_data.IsBanetOpen = false;
   setTimeout(function () {
   $('#banet').text("Open Banet").show();
}, 1000);
   $('#front_left_side').show();
  $('#front_right_side').show();
 
 }
 

 else if(name == "leftdoor" && action_data.IsleftDoorOpen == false){

    viewer.setImage("images/left_side_open.JPG", {
        projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
   });

   action_data.IsleftDoorOpen = true;
   setTimeout(function () {
   $('#leftdoor').text("Close Door").show();
}, 1000);
   $('#front_left_side').show();
  $('#back_left_side').show();

 }
 else if(name == "leftdoor" && action_data.IsleftDoorOpen == true){
 
    viewer.setImage("images/left_side.JPG", {
        projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
   });

   action_data.IsleftDoorOpen = false;
   setTimeout(function () {
   $('#leftdoor').text("Open Door").show();
}, 1000);
   $('#front_left_side').show();
   $('#back_left_side').show();
 }

 
 else if(name == "backdoor" && action_data.IsbacDoorOpen == false){

    viewer.setImage("images/back_open.JPG", {
        projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
   });

   action_data.IsbacDoorOpen = true;
   setTimeout(function () {
   $('#backdoor').text("Close Door").show();
}, 1000);
   $('#back_right_side').show();
  $('#back_left_side').show();

 }
 else if(name == "backdoor" && action_data.IsbacDoorOpen == true){
 
    viewer.setImage("images/back.JPG", {
        projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
   });

   action_data.IsbacDoorOpen = false;
   setTimeout(function () {
   $('#backdoor').text("Open Door").show();
}, 1000);
   $('#back_right_side').show();
   $('#back_left_side').show();
 }



 else if(name == "rightdoor" && action_data.IsrightDoorOpen == false){

    viewer.setImage("images/right_side_open.JPG", {
        projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
   });

   action_data.IsrightDoorOpen = true;
   setTimeout(function () {
   $('#rightdoor').text("Close Door").show();
}, 1000);
   $('#front_right_side').show();
  $('#back_right_side').show();

 }
 else if(name == "rightdoor" && action_data.IsrightDoorOpen == true){
 
    viewer.setImage("images/right_side.JPG", {
        projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
   });

   action_data.IsrightDoorOpen = false;
   setTimeout(function () {
   $('#rightdoor').text("Open Door").show();
}, 1000);
   $('#front_right_side').show();
   $('#back_right_side').show();
 }

  }

  function ChangeView(viewname){



    if(viewname =="interior")
    {
        viewer.setImage("images/R0010696.JPG", {
            projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
       });

       
       $('.marker').hide()
      $('.link').hide()

      $('#interior_menu').css({'display':'inline-flex'});

       viewer.setYawRange([-360, 360]);
       viewer.setPitchRange([-70, 70]);
    }

    else
    {
        viewer.setImage("images/front.JPG", {
            projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
       });

       viewer.setYawRange([-70,80]);
       viewer.setPitchRange([-55, 55]);

       $('#interior_menu').hide();

       $('#front_left_side').attr("data-yaw",45).attr("data-pitch",-20).show('slow');
       $('#front_right_side').attr("data-yaw",-35).attr("data-pitch",-25).show('slow');
      $('#banet').text("Open Banet").show()

     
    }

  }


  function ChangeExteriorView(viewname){

    
    if(viewname =="front")
    {
        viewer.setImage("images/R0010696.JPG", {
            projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
       });
    }

    else  if(viewname =="back"){

        viewer.setImage("images/R0010699.JPG", {
            projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
       });
    }
    else{
        
        viewer.setImage("images/R0010698.JPG", {
            projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
       });
    }

  }
