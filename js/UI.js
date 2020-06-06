

function _UI() {
  const HTML = {

  }

  this.clientPanel = new _UI_clientPanel();
}



function _UI_clientPanel() {
  const HTML = {
    clientHolder: clientListHolder,
  }


  this.setClientList = function(_clients) {
    HTML.clientHolder.innerHTML = "<div class='text header'>CLIENTS</div>";

    for (let i = 0; i < _clients.length; i++) addClientHTML(_clients[i]);
  }



  function addClientHTML(_client) {
    let item = document.createElement("div");
    item.classList.add("clientItem");
    if (_client.isSelf) item.classList.add("self");


    item.innerHTML =  "<div class='clientColor'></div>" + 
                      "<div class='text clientName'>Floris</div>";

    item.children[0].style.background = _client.color;
    setTextToElement(item.children[1], "Client " + _client.id);


    HTML.clientHolder.appendChild(item);
  }

}