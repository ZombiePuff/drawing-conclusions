
    // Wait for device API libraries to load
    //
    function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    // device APIs are available
    //
    function onDeviceReady() {
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
    }


    // Handle the pause event
    //
    function onPause() {
    }

    // Handle the resume event
    //
    function onResume() {
    }


var players;
var timeLimit;
var counter;
var playersLeft;
var myTimer;
var audio = new Audio('audio/wobble.mp3');
var initialPhrase;
var placeholderPhrases = ["High on a hill was a lonely goatherd", "Sleeping Beauty", "Duck-Billed Platypus","Elvis Presley", "A bull in a china shop", "the person next to me","The Justice Leauge","Floppy Disk", "The Three Billy Goats Gruff"];
var dataURL;
var finishedDrawings = [];
var guesses = [];
var drawPhase;

//$(document).on( "pagecontainershow", function(){
//    ScaleContentToDevice();
//
//    $(window).on("resize orientationchange", function(){
//        ScaleContentToDevice();
//    });
//});
//
//function ScaleContentToDevice(){
//    scroll(0, 0);
//    var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() - 18;
//    $("#drawingCanvas").height(content);
//}

$( "#initialPhrasePage" ).on( "pagecontainerbeforeshow", function( event, ui ) {

    $( "#colors > div" ).css( "border", "3px double red" );

} );



function saveSettings(){
    players = $("#numberPlayers").val();
    timeLimit = $("#sliderTimeLimit").val();

     sessionStorage.setItem("players", players);
     sessionStorage.setItem("timeLimit", timeLimit);


    $( "#colors > div" ).css( "border", "3px double red" );

    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#initialPhrasePage", { role: "page" } );
}

$( "#initialPhraseInput" ).textinput({
   create: function(event, ui) {

   $(this).prop("placeholder",placeholderPhrases[randomNumber(placeholderPhrases.length)]);

   }
});

function randomNumber( ) {

    return Math.floor((Math.random() * options));
}
function startGame(){
    var initialPhrase = $( "#initialPhraseInput" ).text();
    sessionStorage.setItem("initialPhrase", $( "#initialPhraseInput" ).val());
    $("#inputText").val($( "#initialPhraseInput" ).val());

    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#drawPage", { role: "page" } );
    counter = sessionStorage.getItem("timeLimit");
    myTimer = setInterval(function(){tick();}, 1000);
    enableDrawing();
    playersLeft = (players -1);
    drawPhase = true;
    $( "#colors > div" ).css( "width", "98%" );
    $('#inputText').parent().css("margin",0);

    enableDrawing();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
  function loadCanvas(dataURL) {
    var canvas = document.getElementById('drawingCanvas');
    var context = canvas.getContext('2d');
      //get rid of old image
      context.clearRect(0, 0, canvas.width, canvas.height);

    // load image from data url
    var imageObj = new Image();
    imageObj.onload = function() {
      context.drawImage(this, 0, 0);
    };

    imageObj.src = dataURL;
  }


$( "#initialPhrasePage" ).on( "pagecontainershow", function( event, ui ){
    var randIndex = Math.floor((Math.random() * 10));
    $("#initialPhraseInput").attr("placeholder", "test");
});


function tick() {
   if(counter>0){
        document.getElementById("clock").innerHTML = counter;

        if(counter==6){
                        document.getElementById("clock").style.color="red";

                        if(drawPhase){
                            $( "#inputText" ).fadeOut(1000);
                        }else if (!drawPhase){
                            $('#drawingCanvas').fadeOut(2000);
                        }


                    }


        counter = counter-1;




    } else {
        if(playersLeft < 1){
            document.getElementById("clock").innerHTML = "STOP";


            AdMob.showInterstitial();


        }else{

            if(counter===0){
                ///////////////////////////////////////////NEXT PLAYER////////////////////////////////////////
                var dataURL = canvas.toDataURL();
                var canvasPosition = finishedDrawings.length;
                var guessPosition = guesses.length;
                finishedDrawings[canvasPosition] = dataURL;
                sessionStorage.setItem("finishedDrawings",finishedDrawings);
                guesses[guessPosition] = $( "#inputText" ).val();
                sessionStorage.setItem("guesses",guesses);
  // SILENCE CUZ I WAS GETTING ANNOYED~  audio.play();
                document.getElementById("clock").innerHTML = "PASS!!!";
                clearTimeout(myTimer);
                counter = sessionStorage.getItem("timeLimit");
                document.getElementById("clock").style.color="black";

                if(drawPhase){
                     /////////switch to guess phase///////
                    disableDrawing();
                    $( "#inputText" ).textinput( {disabled: false} );
                }else{

                    //////switch to draw///////
                    $( "#inputText" ).textinput( {disabled: true} );
                    //reset to standard black and default radius

                    setColor("#000000");
                    $('#black').addClass(" active ui-icon-pencil");
                    radius = defaultRad;
                    context.lineWidth = radius*2;
                    dragging=false;


                    //set up drawing enviornment///
                    $('#drawingCanvas').fadeIn(1000);
                    enableDrawing();

                }


//////////////////////////////////Delayed(for time to pass device) actions////////////////////////////////////////


            setTimeout(function(){
                audio.load();
                playersLeft=playersLeft-1;
                document.getElementById("clock").innerHTML = counter;
                myTimer = setInterval(function(){tick();}, 1000);
                if(drawPhase){

                    drawPhase=false;
                    $( "#inputText" ).fadeIn(1000);
                }else{

                    drawPhase=true;
                }
            }, 3000);
            }else{

                alert("timer error");

            }

        }
    }
}

    // DRAWING CODE


    var canvas = document.getElementById("drawingCanvas");
    var context = document.getElementById("drawingCanvas").getContext("2d");
    var defaultRad = 6;
    var radius = defaultRad;
    var minRadius = 2;
    var maxRadius = 40;
    var step = 2;

    var dragging = false;

window.onload = window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = (window.innerHeight -42);
    context.lineWidth = radius*2;

};



var putPoint = function(e){
    if(dragging){
    context.lineTo(e.clientX,e.clientY);
    context.stroke();
    context.beginPath();
    context.arc(e.clientX,e.clientY,radius,0, Math.PI*2);}
    context.fill();
    context.beginPath();
    context.moveTo(e.clientX,e.clientY);

};

var engage = function(){
    dragging = true;
    putPoint();
};

var disengage = function(){
    dragging = false;
    context.beginPath();
};

function enableDrawing () {
    $('#drawingCanvas').on('vmousedown', engage);
    $('#drawingCanvas').on('vmouseup', disengage);
    $('#drawingCanvas').on('vmousemove', putPoint);
}

function disableDrawing () {
    canvas.removeEventListener('mousemove', putPoint);
    canvas.removeEventListener('touchmove', putPoint);

    canvas.removeEventListener('mousedown', startPoint);
    canvas.removeEventListener('touchstart', startPoint);

    canvas.removeEventListener('mouseup', endPoint);
    canvas.removeEventListener('touchsend', endPoint);
}

    var increaseRadius = document.getElementById('addRadius');

    var decreaseRadius = document.getElementById('subtractRadius');

    increaseRadius.addEventListener('click', function(){
        setRadius(radius+step);
        }
    );

    decreaseRadius.addEventListener('click', function(){
        setRadius(radius-step);
        }
    );

    var setRadius = function(newRadius){
        if(newRadius<minRadius){
            newRadius = minRadius;
        } else if (newRadius>maxRadius){
            newRadius = maxRadius;
        }
        radius = newRadius;
        context.lineWidth = radius*2;
    };

    ////COLORS CODE /////

var colors = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo'];

for(var i=0, n=colors.length;i<n;i++){
    var swatch = document.createElement('a');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = colors[i];
    swatch.addEventListener('click',setSwatch);
    document.getElementById('colors').appendChild(swatch);
}

function setColor(color){
    context.fillStyle = color;
    context.strokeStyle = color;
   var active = document.getElementsByClassName('active')[0];
    if (active) {
        $('.active').removeClass('ui-icon-pencil active');
    }
}


function setSwatch(e) {
    var swatch = e.target;
    swatch.className += ' active ui-icon-pencil';
}


$('#black').on("click", function() {
  setColor("#000000");
  $('#black').addClass(" active ui-icon-pencil");
});

$('#blue').on("click", function() {
  setColor("#0000ff");
  $('#blue').addClass(" active ui-icon-pencil");
});

$('#green').on("click", function() {
  setColor("#008000");
  $('#green').addClass(" active ui-icon-pencil");
});

$('#yellow').on("click", function() {
  setColor("#ffff00");
  $('#yellow').addClass(" active ui-icon-pencil");
});

$('#orange').on("click", function() {
  setColor("#ffa500");
  $('#orange').addClass(" active ui-icon-pencil");
});

$('#red').on("click", function() {
  setColor("#ff0000");
  $('#red').addClass(" active ui-icon-pencil");
});

$('#purple').on("click", function() {
  setColor("#800080");
  $('#purple').addClass(" active ui-icon-pencil");
});

setSwatch({target: document.getElementsByClassName('swatch')[0]});


///////////////////AD MOB ////////////////////////////////////

function onDeviceReady() {
    if (!AdMob) { alert( 'admob plugin not ready' ); return; }

    initAd();

    // this will display the banner at startup
    AdMob.createBanner( admobid.banner );

    // prepare interstitial
    AdMob.prepareInterstitial( admobid.interstitial );


}
function initAd(){
    var defaultOptions = {
            // publisherId: admobid.banner,
            // interstitialAdId: admobid.interstitial,
            // adSize: 'SMART_BANNER',
            // width: integer, // valid when set adSize 'CUSTOM'
            // height: integer, // valid when set adSize 'CUSTOM'
            // position: AdMob.AD_POSITION.BOTTOM_CENTER,
            // x: integer,      // valid when set position to 0 / POS_XY
            // y: integer,      // valid when set position to 0 / POS_XY
            isTesting: true, // set to true, to receiving test ad for testing purpose
            autoShow: false // auto show interstitial ad when loaded, set to false if prepare/show
            };
    AdMob.setOptions( defaultOptions );
    registerAdEvents();
}
// optional, in case respond to events or handle error
function registerAdEvents() {
    document.addEventListener('onBannerFailedToReceive', function(data){
        alert('error: ' + data.error + ', reason: ' + data.reason);
    });
    document.addEventListener('onBannerReceive', function(){});
    document.addEventListener('onBannerPresent', function(){});
    document.addEventListener('onBannerLeaveApp', function(){});
    document.addEventListener('onBannerDismiss', function(){});

    document.addEventListener('onInterstitialFailedToReceive', function(data){
        alert('error: ' + data.error + ', reason: ' + data.reason);
    });
    document.addEventListener('onInterstitialReceive', function(){});
    document.addEventListener('onInterstitialPresent', function(){});
    document.addEventListener('onInterstitialLeaveApp', function(){});
    document.addEventListener('onInterstitialDismiss', function(){});
}

var ad_units = {
        ios : {
            banner: 'ca-app-pub-6869992474017983/4806197152',
            interstitial: 'ca-app-pub-6869992474017983/7563979554'
        },
        android : {
            banner: 'ca-app-pub-4109657928913594/1817477863',
            interstitial: 'ca-app-pub-4109657928913594/9340744663'
        }
    };
var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;
