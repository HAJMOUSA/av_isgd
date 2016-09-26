
 webiopi().ready(init);
 serialusb0 = new Serial("usb0");
 serialusb1 = new Serial("usb1");


 function init () {

 				var updateLightHours = function(macro, args, response) {
							var hours = response.split(";");
							// Following lines use jQuery functions
							$("#inputOn").val(hours[0]);
							$("#inputOff").val(hours[1]);
				}

				//Configure Port Direction
				    webiopi().setFunction(17,"out");
        		webiopi().setFunction(18,"out");
        		webiopi().setFunction(22,"out");
        		webiopi().setFunction(23,"out");

				//Create Handlers
        		var content, button;
        		content = $("#content");
/*
				//Create buttons
        		button = webiopi().createGPIOButton(17,"Prayer Hall");
        		content.append(button);

        		button = webiopi().createGPIOButton(18,"Admin");
        		content.append(button);

        		button = webiopi().createGPIOButton(22,"Nursery");
        		content.append(button);

        		button = webiopi().createGPIOButton(23,"GYMNASIUM");
        		content.append(button);

				//Create edit boxes to show on/off
				webiopi().callMacro("getLightHours", [], updateLightHours);

				button = webiopi().createButton("sendButton", "Send", function() {
							var hours = [$("#inputOn").val(), $("#inputOff").val()];
							webiopi().callMacro("setLightHours", hours, updateLightHours);
						});
				content.append(button);
*/				// Refresh GPIO buttons
				// pass true to refresh repeatedly of false to refresh once
				webiopi().refreshGPIO(true);
				};
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
        //Mute actions
        // Video controls
        function ATEN_Comamnd(who) {
        	if (who.value == 0)
        		document.getElementById("Aten_Command").value="sw o0"+who.name+" off";
        	else
        		document.getElementById("Aten_Command").value="sw i0"+who.value +" o0"+who.name;
        	//Send Data to serial port
            serialusb0.write(document.getElementById("Aten_Command").value+"\r\n");

            var data;
            serialusb0.read(function(data) {
              alert("received " + data)
            });
            serialusb0.read(function(data) {
              alert("received " + data)
            });
            document.getElementById("Aten_Response").value = data;
        }
        //Polycomm Audio controls.
        function ChangeAudioVolume(who)
        {
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
           var data
           serialusb1.read(function(data) {
            alert("received " + data)
          });
          serialusb1.read(function(data) {
           alert("received " + data)
         });
          document.getElementById("Polycomm_Response").value = data;

        }

        function DisableButton(who)
        {
          if(who.checked == true)
            {
              if(who.id == "MH_MUTE"){
                serialusb1.write('set mute "MH_OUTPUT" 1'+"\r\n");
                serialusb1.write('set mute "Main_Prayer_Hall" 1'+"\r\n");
                //$('#MH_OUTPUT').slider('disable');
                //document.getElementById("MH_OUTPUT").disabled = true;
              }else if (who.id =="FY_MUTE"){
                serialusb1.write('set mute "FOYER_OUTPUT" 1'+"\r\n");
                //document.getElementById("FOYER_OUTPUT").disabled = true;
              }else if (who.id =="GY_MUTE"){
                serialusb1.write('set mute "GYM_OUTPUT" 1'+"\r\n");
                serialusb1.write('set mute "Gym_Mic" 1'+"\r\n");
                  //document.getElementById("GYM_OUTPUT").disabled = true;
              }
            }
            else
            {
              if(who.id == "MH_MUTE"){
                serialusb1.write('set mute "MH_OUTPUT" 0'+"\r\n");
                serialusb1.write('set mute "Main_Prayer_Hall" 0'+"\r\n");
                //$('#MH_OUTPUT').slider('enable');
                //document.getElementById("MH_OUTPUT").disabled = false;
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
