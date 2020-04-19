



Message: {
    type: int - see type
    data: /
}



Message.type
- Upstream: Client -> Server
	0: setMousePosition     data: [x, y]


- DownStream: Server -> Client
	0: updateClients		data [{id, mousePosition}]