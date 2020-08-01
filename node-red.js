[{
	"id": "aa377fc8.7fbdd",
	"type": "mqtt out",
	"z": "9f02711f.fb32d",
	"name": "IoTT-Hive",
	"topic": "IoTT_LNBroadcast",
	"qos": "2",
	"retain": "",
	"broker": "cee2b162.af9eb",
	"x": 1356.5,
	"y": 355.74999809265137,
	"wires": []
}, {
	"id": "bcc68df1.453bd",
	"type": "mqtt out",
	"z": "9f02711f.fb32d",
	"name": "IoTT-Mosquitto",
	"topic": "IoTT_LNBroadcast",
	"qos": "2",
	"retain": "",
	"broker": "a0537348.fa649",
	"x": 1378.5,
	"y": 406.74999809265137,
	"wires": []
}, {
	"id": "6f0808f4.84db28",
	"type": "mqtt out",
	"z": "9f02711f.fb32d",
	"name": "IoTT-52",
	"topic": "IoTT_LNBroadcast",
	"qos": "2",
	"retain": "",
	"broker": "ee70d101.93d7e",
	"x": 1361.5,
	"y": 458.74999809265137,
	"wires": []
}, {
	"id": "bd1b22dd.ee812",
	"type": "inject",
	"z": "9f02711f.fb32d",
	"name": "Update Node Trigger",
	"topic": "",
	"payload": "",
	"payloadType": "date",
	"repeat": "5",
	"crontab": "",
	"once": false,
	"x": 187,
	"y": 343.25,
	"wires": [
		["83e5ec44.2b87e"]
	]
}, {
	"id": "b30d9ac2.8aa5f8",
	"type": "function",
	"z": "9f02711f.fb32d",
	"name": "Switch Simulator Function",
	"func": "var ignoreBushby;\nvar swAddr;\nvar swPos;\n\nif (msg.topic == \"RandGen\")\n{\n    ignoreBushby = Math.random() > 0.5;\n    swAddr = Math.round(3 * Math.random())+1;\n    swPos = Math.round(255 * Math.random()) & 0x30;\n}\n\n//everything looking good, let's send the command\nmsg.payload = {\"Cmd\":ignoreBushby?\"swAck\":\"swReq\", \"SwAddr\":swAddr, \"SwPos\":swPos} \nreturn msg;",
	"outputs": 1,
	"noerr": 0,
	"x": 767.0000114440918,
	"y": 344.25000381469727,
	"wires": [
		["93f1d3ca.d5f0d"]
	]
}, {
	"id": "cbdcd58b.c8f888",
	"type": "debug",
	"z": "9f02711f.fb32d",
	"name": "",
	"active": true,
	"console": "false",
	"complete": "false",
	"x": 1370.5,
	"y": 296.74999809265137,
	"wires": []
}, {
	"id": "69eede23.156b8",
	"type": "function",
	"z": "9f02711f.fb32d",
	"name": "Signal Controller Function",
	"func": "var sigHead = Math.round(11 * Math.random())+800;\nvar sigAspect = Math.round(3 * Math.random());\n\nswitch (sigAspect)\n{ \n    case 0: break;\n    case 1: sigAspect = 3; break; \n    case 2: sigAspect = 5; break; \n    default: sigAspect = 10; break; \n}\nmsg.payload = {\"SigHead\":sigHead, \"SigAspect\": sigAspect};\nreturn msg;",
	"outputs": 1,
	"noerr": 0,
	"x": 764.2500114440918,
	"y": 402.0000057220459,
	"wires": [
		["f4217dc0.ff7a5"]
	]
}, {
	"id": "83e5ec44.2b87e",
	"type": "function",
	"z": "9f02711f.fb32d",
	"name": "Random Selector",
	"func": "var thisOutput = Math.trunc(3 * Math.random());\nmsg.topic = \"RandGen\";\nswitch (thisOutput)\n{\n    case 0: return[msg, null, null]; break;\n    case 1: return[null, msg, null]; break;\n    case 2: return[null, null, msg]; break;\n}\nreturn msg;",
	"outputs": 3,
	"noerr": 0,
	"x": 508.00000762939453,
	"y": 433.0000057220459,
	"wires": [
		["b30d9ac2.8aa5f8"],
		["69eede23.156b8"],
		["f16c7036.dd027"]
	]
}, {
	"id": "f16c7036.dd027",
	"type": "function",
	"z": "9f02711f.fb32d",
	"name": "Input Report Function",
	"func": "var bdAddr = Math.round(11 * Math.random());\nvar bdStatus = Math.round(255 * Math.random()) & 0x10;\n\nswitch (bdAddr)\n{\n    case 0: bdAddr = 0; break;\n    case 1: bdAddr = 4; break;\n    case 2: bdAddr = 5; break;\n    case 3: bdAddr = 6; break;\n    case 4: bdAddr = 8; break;\n    case 5: bdAddr = 12; break;\n    case 6: bdAddr = 48; break;\n    case 7: bdAddr = 52; break;\n    case 8: bdAddr = 56; break;\n    case 9: bdAddr = 57; break;\n    case 10: bdAddr = 58; break;\n    case 11: bdAddr = 60; break;\n}\nmsg.payload = {\"BDAddr\": bdAddr, \"BDStatus\": bdStatus};\nreturn msg;",
	"outputs": 1,
	"noerr": 0,
	"x": 748.7500114440918,
	"y": 453.75000762939453,
	"wires": [
		["f159b92d.20f028"]
	]
}, {
	"id": "93f1d3ca.d5f0d",
	"type": "function",
	"z": "9f02711f.fb32d",
	"name": "Send Switch LN",
	"func": "//function to create JSON String for sending to the MQTT broker\nfunction createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"IoTT MQTT Generator\\\", \\\"Valid\\\":1, \\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\nvar ignoreBushby = msg.payload.Cmd == \"swAck\";\nvar swAddr = msg.payload.SwAddr-1;\nvar swPos = (msg.payload.SwPos) === 0 ? 0x10:0x30;\n\n\n//everything looking good, let's send the command\nvar onMsg;\nvar data= [0,0,0];\nif (ignoreBushby === false)\n    data[0] = 0xB0; //OPC_SW_REQ\nelse\n    data[0] = 0xBD; //OPC_SW_ACC to overrule Bushby\ndata[1] = swAddr & 0x7F;\ndata[2] = (swAddr & 0x0780) >>> 7;\ndata[2] = data[2] | (swPos);\nonMsg = {payload : createJSON(data)};\nreturn onMsg;",
	"outputs": 1,
	"noerr": 0,
	"x": 1062.250015258789,
	"y": 344.00000381469727,
	"wires": [
		["cbdcd58b.c8f888", "aa377fc8.7fbdd", "bcc68df1.453bd", "6f0808f4.84db28"]
	]
}, {
	"id": "f4217dc0.ff7a5",
	"type": "function",
	"z": "9f02711f.fb32d",
	"name": "Send Signal LN",
	"func": "//function to create JSON String for sending to the MQTT broker\nfunction createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"IoTT MQTT Generator\\\", \\\"Valid\\\":1, \\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\n//in case the user has not set a Head Address, we exit without sending anything\nvar sigHead = msg.payload.SigHead-1;\nvar sigAspect = msg.payload.SigAspect;\n\n//everything looking good, let's send the command\nvar onMsg;\nvar data= [0xED,0x0B,0x7F,0,0,0,0,0,0,0];\nvar boardAddr = (((sigHead-1) & 0x07FC)>>2) + 1;\nvar turnoutIndex = (sigHead-1) & 0x03;\ndata[3] = 0x31; //3 IM Bytes, 3 repetitions\ndata[5] = ((boardAddr & 0x003F)) | 0x80; //IM1\ndata[6] = ( (~boardAddr & 0x01C0)>>2) | ((turnoutIndex & 0x03)<<1) | 0x01; //IM2\ndata[7] = (sigAspect & 0x01FF); //IM3\ndata[4] = ((data[5] & 0x80)>>7) + ((data[6] & 0x80)>>6) + 0x20; //DHI\ndata[5] &= 0x7F;\ndata[6] &= 0x7F;\nonMsg = {payload : createJSON(data)};\nreturn onMsg;",
	"outputs": 1,
	"noerr": 0,
	"x": 1061.000015258789,
	"y": 404.00000190734863,
	"wires": [
		["cbdcd58b.c8f888", "aa377fc8.7fbdd", "bcc68df1.453bd", "6f0808f4.84db28"]
	]
}, {
	"id": "f159b92d.20f028",
	"type": "function",
	"z": "9f02711f.fb32d",
	"name": "Send Input Report LN",
	"func": "//function to create JSON String for sending to the MQTT broker\nfunction createJSON(fromData)\n{\n    var retStr = \"{\\\"From\\\":\\\"IoTT MQTT Generator\\\", \\\"Valid\\\":1, \\\"Data\\\":[\";\n    var xorCode = 0;\n    for (i = 0; i < fromData.length; i++)\n    {\n        var byteCode = parseInt(fromData[i]);\n        retStr = retStr + byteCode.toString() + \",\"\n        xorCode = xorCode ^ byteCode;\n    }\n    xorCode = xorCode ^ 0xFF;\n    retStr = retStr + xorCode.toString() + \"]}\";\n    return retStr;\n}\n\n//in case Bushby bit data is not stored, we initialize it to CLEARED\nvar bdAddr = msg.payload.BDAddr;\nvar swStatus = msg.payload.BDStatus;\n\n\n//everything looking good, let's send the command\nvar onMsg;\nvar data= [0,0,0];\ndata[0] = 0xB2; //OPC_INPUT_REP\ndata[1] = (bdAddr & 0xFE) >>> 1;\ndata[2] = ((bdAddr & 0x0780) >> 7) | ((bdAddr & 0x01) << 5);\ndata[2] = data[2] | (swStatus);\nonMsg = {payload : createJSON(data)};\nreturn onMsg;",
	"outputs": 1,
	"noerr": 0,
	"x": 1081.000015258789,
	"y": 454.00000286102295,
	"wires": [
		["cbdcd58b.c8f888", "aa377fc8.7fbdd", "bcc68df1.453bd", "6f0808f4.84db28"]
	]
}, {
	"id": "13a3ec6e.c8d6a4",
	"type": "mqtt in",
	"z": "9f02711f.fb32d",
	"name": "JMRI MQTT Mosquitto",
	"topic": "/IoTTBridge/track/turnout/#",
	"qos": "2",
	"broker": "f0c0f874.9c45f8",
	"x": 174.8958282470703,
	"y": 202.49999380111694,
	"wires": [
		["ac8851ae.5391c", "682b8d17.29a5e4"]
	]
}, {
	"id": "682b8d17.29a5e4",
	"type": "debug",
	"z": "9f02711f.fb32d",
	"name": "",
	"active": false,
	"console": false,
	"complete": "false",
	"x": 596.3958358764648,
	"y": 165.99999856948853,
	"wires": []
}, {
	"id": "ac8851ae.5391c",
	"type": "function",
	"z": "9f02711f.fb32d",
	"name": "JMRI Decoder",
	"func": "var swiPos = msg.payload == \"CLOSED\"? 1:0;\nvar topIndex = msg.topic.lastIndexOf(\"/\");\nvar addrLen = msg.topic.length - topIndex - 1;\nvar swiAddr = parseInt(msg.topic.substr(topIndex+1, addrLen));\nmsg.payload = {\"Cmd\":\"SwReq\", \"SwAddr\":swiAddr, \"SwPos\":swiPos};\nmsg.topic = \"JMRICmd\";\nreturn msg;",
	"outputs": 1,
	"noerr": 0,
	"x": 603.8957939147949,
	"y": 246.50000762939453,
	"wires": [
		["93f1d3ca.d5f0d"]
	]
}, {
	"id": "cee2b162.af9eb",
	"type": "mqtt-broker",
	"z": "",
	"broker": "broker.hivemq.com",
	"port": "1883",
	"clientid": "LocoNetViewer25",
	"usetls": false,
	"compatmode": true,
	"keepalive": "60",
	"cleansession": true,
	"willTopic": "",
	"willQos": "0",
	"willPayload": "",
	"birthTopic": "",
	"birthQos": "0",
	"birthPayload": ""
}, {
	"id": "a0537348.fa649",
	"type": "mqtt-broker",
	"z": "",
	"broker": "test.mosquitto.org",
	"port": "1883",
	"tls": "",
	"clientid": "",
	"usetls": false,
	"compatmode": true,
	"keepalive": "60",
	"cleansession": true,
	"willTopic": "",
	"willQos": "0",
	"willPayload": "",
	"birthTopic": "",
	"birthQos": "0",
	"birthPayload": ""
}, {
	"id": "ee70d101.93d7e",
	"type": "mqtt-broker",
	"z": "",
	"broker": "192.168.87.52",
	"port": "1883",
	"clientid": "",
	"usetls": false,
	"compatmode": true,
	"keepalive": "60",
	"cleansession": true,
	"willTopic": "",
	"willQos": "0",
	"willPayload": "",
	"birthTopic": "",
	"birthQos": "0",
	"birthRetain": "false",
	"birthPayload": ""
}, {
	"id": "f0c0f874.9c45f8",
	"type": "mqtt-broker",
	"z": "",
	"broker": "test.mosquitto.org",
	"port": "1883",
	"tls": "",
	"clientid": "",
	"usetls": false,
	"compatmode": true,
	"keepalive": "60",
	"cleansession": true,
	"willTopic": "",
	"willQos": "0",
	"willPayload": "",
	"birthTopic": "",
	"birthQos": "0",
	"birthPayload": ""
}]
