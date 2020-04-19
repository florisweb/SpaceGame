const Server = new function() {
    this.socket;
    let reConnectAttempts = 0;

    this.clients = [];


    this.sendPacket = function(_type, _data) {
        if (!this.socket) return;
        let packet = JSON.stringify({
            type: parseInt(_type),
            data: _data
        });
        this.socket.send(packet);
    }


    this.init = function() {
        this.socket = new WebSocket("ws://localhost:8080", "spaceGame-protocol");

        this.socket.onopen = function(_e) {
            reConnectAttempts = 0;
            console.log(_e);
        }

        this.socket.onmessage = function(_e) {
            handlePacket(JSON.parse(_e.data));
        }

        this.socket.onerror = function(_e) {
            console.log("[Error] " + _e.data);
        }

        this.socket.onclose = function(_e) {
            if(_e.wasClean) {
                console.log("Disconnected.");
            } else {
                reConnectAttempts++;
                if (reConnectAttempts > 5) return;

                console.log("Connection died. -- Reconnecting...");
                setTimeout(function () {Server.init()}, 1000);
            }
        }
    }


    function handlePacket(_packet) {
        switch (_packet.type)
        {
            case 0: updateClientArray(_packet.data); break;
            default: console.log("[Message]", _packet); break;
        }
    }

    function updateClientArray(_data) {
        Server.clients = [];
        for (let i = 0; i < _data.length; i++)
        {
            let client = _data[i];
            client.mousePosition = new Vector(client.mousePosition);

            Server.clients.push(client);
        }
    }
}