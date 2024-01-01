$(document).ready(function () {
    $('#loading').hide();
    loadLabel();
    $.ajax({
        url: `/account/getAssetsByAccount/${getUsername()}`,
        type: 'GET',
        dataType: 'json',
        success: function (resp) {
            if (resp && resp.assets && resp.assets.length > 0) {
                $('tbody').empty();
                resp.assets.forEach(function (asset) {
                    let row = `
                        <tr id=${asset.ID}>
                        <td>${asset.ID}</td>
                        <td>${asset.ProductLot}</td>
                        <td>${asset.ProductName}</td>
                        <td>${asset.AppraisedValue}</td>
                        <td><button onClick="clickEdit(event)" class="buy-button" data-asset='${JSON.stringify(asset)}'>Edit</button></td>
                        </tr>
                    `
                    $('tbody').append(row);
                });
            }
        },
        error: function (error) {
            console.log('Get assests failed:', error);
        }
    });

    function reset() {
        $('#productName').val('');
        $('#productPrice').val('');
        $('#status').text('Create');
        $('#addEditBtn').val('Create');
    }

    $('#addEditBtn').on('click', function (e) {
        e.preventDefault();
        let flag = validate();

        if (flag && $('#status').text() === 'Create') {
            $('#loading').show();
            $.ajax({
                url: `/transfer/create`,
                type: 'POST',
                dataType: 'json',
                data: {
                    ProductName: $('#productName').val(),
                    Owner: getUsername(),
                    AppraisedValue: $('#productPrice').val()
                },
                success: function (resp) {
                    let row = `
                        <tr>
                        <td>${resp.ID}</td>
                        <td>${resp.ProductLot}</td>
                        <td>${resp.ProductName}</td>
                        <td>${resp.AppraisedValue}</td>
                        <td><button onClick="clickEdit(event)" class="buy-button" data-asset='${JSON.stringify(resp)}'>Edit</button></td>
                    `
                    $('tbody').append(row);
                    alert('Create asset successfully')
                    $('#loading').hide();

                },
                error: function (error) {
                    alert('Create asset failed')
                    console.log('Create asset failed:', error);
                    $('#loading').hide();
                }
            });
        } else if (flag && $('#status').text() === 'Update') {
            if($('#productName').val() === window.asset.ProductName && $('#productPrice').val() === window.asset.AppraisedValue) {
                return reset();
            }
            $('#loading').show();
            $.ajax({
                url: `/transfer/update`,
                type: 'PUT',
                dataType: 'json',
                data: {
                    ID: window.asset.ID,
                    ProductName: $('#productName').val(),
                    AppraisedValue: $('#productPrice').val()
                },
                success: function (resp) {
                    let row = `
                        <td>${resp.ID}</td>
                        <td>${resp.ProductLot}</td>
                        <td>${resp.ProductName}</td>
                        <td>${resp.AppraisedValue}</td>
                        <td><button onClick="clickEdit(event)" class="buy-button" data-asset='${JSON.stringify(resp)}'>Edit</button></td>
                    `
                    $(`#${window.asset.ID}`).html(row);
                    alert('Update asset successfully');
                    $('#loading').hide();
                },
                error: function (error) {
                    alert('Update asset failed');
                    console.log('Update asset failed:', error);
                    $('#loading').hide();
                }
            });
        }
        reset();
    })
})

function validate() {
    let name = $('#productName').val();
    let price = $('#productPrice').val();

    if(!name || name.trim().length === 0) {
        alert('Please enter product name');
        return false;
    } else if(!price || price.trim().length === 0) {
        alert('Please enter product price');
        return false;
    } else {
        return true;
    }
}

function clickEdit(event) {
    loadLabel();
    window.asset = JSON.parse(event.currentTarget.getAttribute('data-asset'));
    $('#productName').val(window.asset.ProductName);
    $('#productPrice').val(window.asset.AppraisedValue);
}

function getUsername() {
    return JSON.parse($("#inv-username").text()).gmail;
}

function loadLabel() {
    let status = $('#status').text();
    if (!status || status == 'add') {
        $('#status').text('Create');
        $('#addEditBtn').val('Create');
    } else {
        $('#status').text('Update');
        $('#addEditBtn').val('Update');
    }
}