
var $breed_select = $('select.breed_select');
$breed_select.change(function () {
    var id = $(this).children(":selected").attr("id");
    if (id == 'None') {
        clearBreed();
        return
    }
    getCatByBreed(id)
});


function getCarroselCat(breed_id) {
    var carousel_cats = document.getElementById("carousel_cats");
    carousel_cats.style.display = "block";
    getImagesCat(breed_id.id);
};

function getImagesCat(breed_id) {
    $("#carousel_cats_inner div").remove();
    ajax_get('https://api.thecatapi.com/v1/images/search?limit=8&breed_ids=' + breed_id, function (data) {
        console.log(data);
        data.forEach(function (item, index) {
            if (index == 0) {
                $("#carousel_cats_inner").append(
                    '<div class="carousel-item active"><img style="width: auto; height: auto;" class="d-block mh-100 mw-100" src="' + item.url + '" alt="' + item.url + '"></div>'
                );
            } else {
                $("#carousel_cats_inner").append(
                    '<div class="carousel-item"><img style="width: auto; height: auto;" class="d-block mh-100 mw-100" src="' + item.url + '" alt="' + item.url + '"></div>'
                );
            }
            console.log(item, index);
        });
    });
}

function getBreeds() {
    ajax_get('https://api.thecatapi.com/v1/breeds', function (data) {
        populateBreedsSelect(data)
    });
}

function populateBreedsSelect(breeds) {
    $breed_select.empty().append(function () {
        var output = '';
        output += '<option id="' + 'None' + '">' + '' + '</option>';
        $.each(breeds, function (key, value) {
            output += '<option id="' + value.id + '">' + value.name + '</option>';
        });
        return output;
    });

}

function getCatByBreed(breed_id) {
    ajax_get('https://api.thecatapi.com/v1/images/search?include_breed=1&breed_id=' + breed_id, function (data) {

        if (data.length == 0) {
            // if there are no images returned
            clearBreed();
            $("#breed_data_table").append("<tr><td>Sem informações sobre este gatinho :( </td></tr>");
        } else {
            displayBreed(data[0])
            $("#breed_data_table").append(
                "<br><button style='margin-left: 80%' id='give_cat' class='btn btn-warning' onclick='getCarroselCat(" + breed_id + ")'>Mais fotos, por favor!</button>"
            );
        }
    });
}

function clearIds() {
    $("#breed_data_table tr").remove();
    $("#breed_data_table br").remove();
    $("#breed_data_table button").remove();
    $("#carousel_cats_inner div").remove();
    var carousel_cats = document.getElementById("carousel_cats");
    carousel_cats.style.display = "none";
}

function clearBreed() {
    $('#breed_image').attr('src', "");
    clearIds();
}

function displayBreed(image) {
    $('#breed_image').attr('src', image.url);
    clearIds();

    var breed_data = image.breeds[0]
    $.each(breed_data, function (key, value) {
        if (key == 'weight' || key == 'height') value = value.metric

        new_key = "none";

        if (key == "weight") new_key = 'Peso (Kg):';
        if (key == "name") new_key = 'Nome:';
        if (key == "id") new_key = 'Código identificador:';
        if (key == "temperament") new_key = 'Temperamento:';
        if (key == "origin") new_key = 'Origem:';
        if (key == "description") new_key = 'Descrição:';
        if (key == "life_span") new_key = 'Estimativa de vida (Anos):';
        if (key == "indoor") new_key = 'Indicado para gato doméstico:';
        if (key == "tap") new_key = 'Carinhoso';
        if (key == "adaptability") new_key = 'Adaptabilidade:';
        if (key == "affetction_level") new_key = 'Afeição:';
        if (key == "child_friendly") new_key = 'Gosta de crianças:';
        if (key == "dog_friendly") new_key = 'Gosta de gatos:';
        if (key == "energy_level") new_key = 'Nível de energia:';
        if (key == "grooming") new_key = 'Cuidadoso:';
        if (key == "health_issues") new_key = 'Problemas de saúde:';
        if (key == "intelligence") new_key = 'Inteligência:';
        if (key == "shedding_level") new_key = 'Propensão a fugas:';
        if (key == "social_needs") new_key = 'Nível social:';
        if (key == "stranger_friendly") new_key = 'Gosta de estranhos:';
        if (key == "vocalisation") new_key = 'Vocalização:';
        if (key == "experimental") new_key = 'Exótico:';
        if (key == "hairless") new_key = 'Perda de pelo:';
        if (key == "natural") new_key = 'Raça natural:';
        if (key == "rare") new_key = 'Raro:';
        if (key == "rex") new_key = 'Pelagem aveludada:';
        if (key == "suppressed_tail") new_key = 'Cauda suprimida:';
        if (key == "short_legs") new_key = 'Pernas curtas:';
        if (key == "wikipedia_url") new_key = 'Link da Wikipédia:';
        if (key == "hypoallergenic") new_key = 'Hipoalergênico:';
        if (key == "reference_image_id") new_key = 'Código de referência da imagem:';
        if (new_key !== "none") {
            if (Number.isInteger(value)) {
                value_in = ''
                for (i = 0; i < value; i++) {
                    value_in += '⭐'
                }
                if (value_in == '') value_in = '-'
            } else {
                value_in = value
            }
            $("#breed_data_table").append("<tr><td>" + new_key + "</td><td>" + value_in + "</td></tr>");
        }
    });
}

function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("x-api-key", 'DEMO-API-KEY');
    xmlhttp.send();
}
getBreeds();


function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
}