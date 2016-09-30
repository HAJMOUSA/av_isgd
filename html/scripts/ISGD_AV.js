
 webiopi().ready(init);
 serialusb0 = new Serial("usb0");
 serialusb1 = new Serial("usb1");


 function init () {
//Send command to get different fader values.
serialusb1.write('get fader "MH_OUTPUT" '+"\r\n");
serialusb1.write('get fader "FOYER_OUTPUT" '+"\r\n");
serialusb1.write('get fader "GYM_OUTPUT" '+"\r\n");
//wait for time delay of 1 seconds to allow polycomm reply
setTimeout(PolycommInit, 500);
}
//Function to parse responses and populate default values.
        function PolycommInit(){
          serialusb1.read(function(data){
            data1 = data;
            MH_OUTPUT.value = data1.split("MH_OUTPUT").pop().substring(1,7).replace(/[^\d.-]/g, '');
            data1 = data;
            FOYER_OUTPUT.value = data1.split("FOYER_OUTPUT").pop().substring(1,7).replace(/[^\d.-]/g, '');
            data1 = data;
            GYM_OUTPUT.value = data1.split("GYM_OUTPUT").pop().substring(1,7).replace(/[^\d.-]/g, '');;
        });
      }
        //Jquery events
        $(document).ready(function(){
            $('.isgdmute').on("vclick", function() {
                  DisableButton(this);
            });
            $('.isgdslider').on("slidestop", function() {
                ChangeAudioVolume(this);
            });

            $('select').on("change",function () {
                ATEN_Comamnd(this);
            });
        });
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
          if(who.checked == true)
            {
              if(who.id == "MH_MUTE"){
                serialusb1.write('set mute "MH_OUTPUT" 1'+"\r\n");
                serialusb1.write('set mute "Main_Prayer_Hall" 1'+"\r\n");
                $("#MH_OUTPUT").hide();
              }else if (who.id =="FY_MUTE"){
                serialusb1.write('set mute "FOYER_OUTPUT" 1'+"\r\n");
              }else if (who.id =="GY_MUTE"){
                serialusb1.write('set mute "GYM_OUTPUT" 1'+"\r\n");
                serialusb1.write('set mute "Gym_Mic" 1'+"\r\n");
              }
            }
            else
            {
              if(who.id == "MH_MUTE"){
                serialusb1.write('set mute "MH_OUTPUT" 0'+"\r\n");
                serialusb1.write('set mute "Main_Prayer_Hall" 0'+"\r\n");
                $("#MH_OUTPUT").show();
              }else if (who.id =="FY_MUTE"){
                serialusb1.write('set mute "FOYER_OUTPUT" 0'+"\r\n");
                //document.getElementById("FOYER_OUTPUT").disabled = false;
              }else if (who.id =="GY_MUTE"){
                serialusb1.write('set mute "GYM_OUTPUT" 0'+"\r\n");
                serialusb1.write('set mute "Gym_Mic" 0'+"\r\n");
                //document.getElementById("GYM_OUTPUT").disabled = false;
              }
          }
        }
