
$('#custo').on('change', function (event) {
    let custo = document.getElementById('custo').value
    let ipv = document.getElementById('ipv').value
    let preco = document.getElementById('preco')
    soma = custo * ipv
    preco.value = soma.toFixed(2)
})

$('#ipv').on('change', function (event) {
    let custo = document.getElementById('custo').value
    let ipv = document.getElementById('ipv').value
    let preco = document.getElementById('preco')
    if (ipv < 1.5) {
        alert('IPV minimo 1.5')
        soma = custo * 1.5
        preco.value = soma.toFixed(2)
        document.getElementById('ipv').value = 1.5
    } else {
        soma = custo * ipv
        preco.value = soma.toFixed(2)
    }
})

$('#estoque').on('change', function (event) {
    let estoque = document.getElementById('estoque').value
    let reservada = document.getElementById('reservada').value
    let qtd_ec = document.getElementById('qtd_ec')
    qtd_ec.value = estoque - reservada
})

$('#reservada').on('change', function (event) {
    let estoque = document.getElementById('estoque').value
    let reservada = document.getElementById('reservada').value
    let qtd_ec = document.getElementById('qtd_ec')
    qtd_ec.value = estoque - reservada
})