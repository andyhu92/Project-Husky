$(document).ready(function(){
    var foodAnimationInterval, isPoop = false;
    initPage();

    function initPage(){
        $("#food").hide();
        var animationEnd = (function(el) {
            var animations = {
              animation: 'animationend',
              OAnimation: 'oAnimationEnd',
              MozAnimation: 'mozAnimationEnd',
              WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
              if (el.style[t] !== undefined) {
                return animations[t];
              }
            }
          })(document.createElement('div'));

        $('#dog').one(animationEnd, function(){
             initGame();
        });
    }

    function initHuskyEyes(){
        $(".hidden").removeClass("hidden");
    }

    function initGame(){
        initHuskyEyes();
        startFoodAnimation();
        registerGameStartEvent();
    }

    function isInsideMouse(x, y){
        var $mouth = $(".mouse");
        var offset = $mouth.offset(), width = parseInt($mouth.css("width")), height = parseInt($mouth.css("height"));
        return x >= offset.left && x <= offset.left + width && y > offset.top && y <= offset.top + height;
    }

    function registerGameStartEvent(){
        $("#food").one('mouseenter', function(){
            endFoodAnimation();
            rollYourEye();
        });
    }

    function restartGame(){
        $("#food").css("position","static");
        $(".left .black").css({top:6, left:6});
        $(".right .black").css({top:7, left:6});
        $("body").off("mousemove");
        initGame();
    }

    // Begin eyes rolling!
    function rollYourEye(){
        var FOOD_WIDTH = parseInt($("#food").css("position","absolute").css("width"));
        var EYE_MOVE_RANGE = parseInt($(".eye").css("width")) / 2;

        var $leftEye = $(".left .black"), $rightEye = $(".right .black");
        var leftCoord = {
            x: parseInt($leftEye.css("right")),
            y: parseInt($leftEye.css("top"))
        };

        var rightCoord = {
            x: parseInt($rightEye.css("right")),
            y: parseInt($rightEye.css("top"))
        };
        var leftOffset = $(".left.eye").offset(), rightOffset = $(".right.eye").offset();

        $("body").on("mousemove", function(e){
            var x = e.clientX, y = e.clientY;
            if(isInsideMouse(x, y)){
                var src = isPoop ? "./img/red-eye.gif" : "./img/gold-eye.gif";
                $(".white").attr("src",src)
            }else{
                $(".white").attr("src","./img/white-eye.gif");
            }
            //Make food move along with mouse
            $("#food").css({left:x - FOOD_WIDTH/2, top:y - FOOD_WIDTH/2});

            var newLeftX = leftCoord.x + (x - leftOffset.left) / (innerWidth / 2) * EYE_MOVE_RANGE,
                newLeftY = leftCoord.y + (y - leftOffset.top) / (innerHeight / 1.7) * EYE_MOVE_RANGE,
                newRightX = rightCoord.x + (x - rightOffset.left) / (innerWidth / 2) * EYE_MOVE_RANGE,
                newRightY = rightCoord.y + (y - rightOffset.top) / (innerHeight / 1.7) * EYE_MOVE_RANGE;

            //Make it inside the range
            if(square(newLeftX - leftCoord.x) + square(newLeftY - leftCoord.y) > square(EYE_MOVE_RANGE)) return;

            $(".left .black").css("top", newLeftY).css("left", newLeftX);
            $(".right .black").css("top", newRightY).css("left", newRightX);
        }).one("click", function(){
            restartGame();
        })
    }

    function square(n){
        return n * n;
    }

    // Start change food animation
    function startFoodAnimation(){
        $("#food").show();
        foodAnimationInterval = setInterval(function(){
            var imgSrc = isPoop ? "./img/food.png" : "./img/poop.png";
            $('#food').attr("src",imgSrc);
            isPoop = !isPoop;
        },500);
    }

    // Stop change food animation
    function endFoodAnimation(){
        clearInterval(foodAnimationInterval);
    }
})

