
 webiopi().ready(init);
 serialusb0 = new Serial("usb0");
 serialusb1 = new Serial("usb1");


 function init () {
//Send command to get different fader values.
serialusb1.write('get fader "MH_OUTPUT" '+"\r\n");
serialusb1.write('get fader "FOYER_OUTPUT" '+"\r\n");
serialusb1.write('get fader "GYM_OUTPUT" '+"\r\n");
serialusb1.write('get mute  "MH_OUTPUT"'+"\r\n");
serialusb1.write('get mute "FOYER_OUTPUT" '+"\r\n");
serialusb1.write('get mute "GYM_OUTPUT" '+"\r\n");
//wait for time delay of 1 seconds to allow polycomm reply
setTimeout(PolycommInit, 1000);
}
//Function to parse responses and populate default values.
        function PolycommInit(){
          serialusb1.read(function(data){
            data1 = data;
            MH_OUTPUT.value = Number(data1.split('val fader "MH_OUTPUT"').pop().substring(1,7).replace(/[^\d.-]/g, ''));
            data1 = data;
            FOYER_OUTPUT.value = Number(data1.split('val fader "FOYER_OUTPUT"').pop().substring(1,7).replace(/[^\d.-]/g, ''));
            data1 = data;
            GYM_OUTPUT.value = Number(data1.split('val fader "GYM_OUTPUT"').pop().substring(1,7).replace(/[^\d.-]/g, ''));
            data1 = data;
            MH_MUTE.checked = Boolean(Number(data1.split('val mute "MH_OUTPUT"').pop().substring(1,7).replace(/[^\d.-]/g, '')));
            data1 = data;
            FY_MUTE.checked = Boolean(Number(data1.split('val mute "FOYER_OUTPUT"').pop().substring(1,7).replace(/[^\d.-]/g, '')));
            data1 = data;
            GY_MUTE.checked  = Boolean(Number(data1.split('val mute "GYM_OUTPUT"').pop().substring(1,7).replace(/[^\d.-]/g, '')));

        });
      }
        //Jquery events
        $(document).ready(function(){
            $('.isgdmute').on("change", function() {
                  DisableButton(this);
            });
            $('.isgdslider').on("slidestop", function() {
                ChangeAudioVolume(this);
            });

            $('select').on("change",function () {
                ATEN_Comamnd(this);
            });
        });
        function PolycommMute(who){
          serialusb1.read(function(data){
            //read response and make extract volume control.
            if(data ==='')
              alert(" Communication problems, check internet connection")
            else {
                var temp = data.split(who.name);
                if(temp.length === 1)
                  alert(" Communication problems, check internet connection")
                else {
                      who.value = Boolean(Number(temp.pop().substring(1,7).replace(/[^\d.-]/g, '')));
                      document.getElementById("Polycomm_Response").value = who.value;
                }
            }
          });
        }
        function AtenCollectData(){
          serialusb0.read(function(data) {
            document.getElementById("Aten_Response").value = data;
          });
        }
        function PolycommCollectData(who){
          serialusb1.read(function(data){
            //read response and make extract volume control.
            temp = data.split(who.id).pop().substring(1);
            document.getElementById("Polycomm_Response").value = temp
            who.value = temp.trim();
          });
        }

        function ATEN_Comamnd(who) {
        	if (who.value == 0)
        		document.getElementById("Aten_Command").value="sw o0"+who.name+" off";
        	else
        		document.getElementById("Aten_Command").value="sw i0"+who.value +" o0"+who.name;
        	//Send Data o serial port
            serialusb0.write(document.getElementById("Aten_Command").value+"\r\n");
            setTimeout(AtenCollectData, 500);
        }
        //Polycomm Audio controls.
        function ChangeAudioVolume(who)
        {
          //flush buffer
          if(who.id == "MH_OUTPUT"){
            if(  document.getElementById("MH_MUTE").checked ==false)
              serialusb1.write('set fader "MH_OUTPUT" '+ who.value+"\r\n");
          }
          else if(who.id == "FOYER_OUTPUT"){
            if(  document.getElementById("FY_MUTE").checked ==false)
              serialusb1.write('set fader "FOYER_OUTPUT" '+ who.value+"\r\n");
          }
          else if(who.id == "GYM_OUTPUT"){
            if(  document.getElementById("GY_MUTE").checked ==false)
              serialusb1.write('set fader "GYM_OUTPUT" '+who.value+"\r\n");
          }
          setTimeout(PolycommCollectData, 500,who);
        }

        function DisableButton(who)
        {
              if(who.id == "MH_MUTE"){
                serialusb1.write('set mute "MH_OUTPUT" '+Number(who.checked)+"\r\n");
                serialusb1.write('set mute "Main_Prayer_Hall" '+Number(who.checked)+"\r\n");
              }else if (who.id =="FY_MUTE"){
                serialusb1.write('set mute "FOYER_OUTPUT" '+Number(who.checked)+"\r\n");
              }else if (who.id =="GY_MUTE"){
                serialusb1.write('set mute "GYM_OUTPUT" '+Number(who.checked)+"\r\n");
                serialusb1.write('set mute "Gym_Mic" '+Number(who.checked)+"\r\n");
              }
          setTimeout(PolycommMute, 500,who);
      }
