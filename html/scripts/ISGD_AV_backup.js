 webiopi().ready(function() {
        		webiopi().setFunction(17,"out");
        		webiopi().setFunction(18,"out");
        		webiopi().setFunction(22,"out");
        		webiopi().setFunction(23,"out");
        		
        		var content, button;
        		content = $("#content");
        		
        		button = webiopi().createGPIOButton(17,"Prayer Hall");
        		content.append(button);
        		
        		button = webiopi().createGPIOButton(18,"Admin");
        		content.append(button);
        		
        		button = webiopi().createGPIOButton(22,"Nursery");
        		content.append(button);
        		
        		button = webiopi().createGPIOButton(23,"GYM");
        		content.append(button);
        		
        });