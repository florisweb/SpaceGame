
let Clients = [];
module.exports.Clients = Clients;

Clients.removeClient = function(_id) {
    for (let i = 0; i < this.length; i++)
    {
        if (this[i].id != _id) continue;
        let client = this.splice(i, 1);
        if (client.connection) client.connection.close();
        return true;
    }
    return false;
};

Clients.serialize = function() {
    let data = [];
    for (let i = 0; i < this.length; i++) data.push(this[i].serialize());
    return data;
}

Clients.broadCast = function(_data) {
    for (let i = 0; i < this.length; i++) this[i].send(_data);
}
Clients.broadCastSelf = function() {
    for (let i = 0; i < this.length; i++) this[i].sendClientArray();
}



Clients.addClient = function(_connection) {
    let Client = new _Client(_connection);
    this.push(Client);

    Client.connection.on('message', function(message) {
        Client.onMessage(message.utf8Data);
    });

    Client.connection.on('close', function(connection) {
        Client.remove();
    });

    Clients.broadCastSelf();
}
















function _Client(_connection) {
    this.id         = newId();
    this.connection = _connection;
    this.mousePosition = new Vector([0, 0]);


    this.send = function(_str) {
       this.connection.send(_str);
    }
    
    this.onMessage = function(_message) {
        let message = JSON.parse(_message);

        switch (message.type) 
        {
            case 0: this.setMousePosition(message.data); Clients.broadCastSelf(); break;
            default:
                console.log("[Messsage] from " + this.id + ": " + _message);
            break;
        }
    }

    this.remove = function() {
        Clients.removeClient(this.id);
    }

    this.setMousePosition = function(_data) {
        // do some checks to make sure the mouse is even in the world
        this.mousePosition = new Vector(_data);
    }


    this.serialize = function() {
        let client = {
            id: this.id,
            mousePosition: this.mousePosition.value,
        };
        return client;
    }

    this.sendClientArray = function() {
        let clients = Clients.serialize();
        for (let i = 0; i < clients.length; i++)
        {
            if (clients[i].id != this.id) continue;
            clients[i].isSelf = true;
            break;
        } 

        let packet = {
            type: 0,
            data: clients,
        }
        this.send(JSON.stringify(packet));
    }
}


































function newId() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}
