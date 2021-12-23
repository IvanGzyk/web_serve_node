
/** Busca o item por id **/
let bt = document.querySelector("#buscar")
if (bt) {
    console.log(bt)
    bt.addEventListener("click", function (e) {
        if (document.querySelector("#item_id").value != '') {
            let id = document.querySelector("#item_id").value
            url = "http://192.168.0.242:3000/item/" + id
            window.location.href = url
        } else {
            alert('Digite um id')
        }
    })
}
