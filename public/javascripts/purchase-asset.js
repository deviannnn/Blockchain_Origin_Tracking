$(document).ready(function () {
    $.ajax({
        url: '/account/getAssetsByFarmer',
        type: 'POST',
        success: function (data) {
            if (data.success) {
                updateTable(data.assets);
            } else {
                alert('Failed to get assets by farmer');
            }
        },
        error: function () {
            alert('Error! An error occurred. Please try again later.');
        }
    });

    function updateTable(assets) {
        $('tbody').empty();

        assets.forEach(function (asset) {
            var row = '<tr>' +
                '<td>' + asset.ID + '</td>' +
                '<td>' + asset.ProductLot + '</td>' +
                '<td>' + asset.ProductName + '</td>' +
                '<td>' + asset.AppraisedValue + '</td>' +
                '<td>' + asset.Owner + '</td>' +
                '<td><button class="buy-button" data-asset-id="' + asset.ID + '">Purchase</button></td>' +
                '</tr>';

            $('tbody').append(row);
        });

        $('.buy-button').on('click', function () {
            var assetID = $(this).data('asset-id');
            purchaseAsset(assetID);
        });
    }

    function purchaseAsset(assetID) {
        $('#loading').show();
        $.ajax({
            type: 'POST',
            url: '/transfer/trans',
            data: { ID: assetID },
            success: function (data) {
                if (data.success) {
                    alert('Asset purchased successfully.');
                    window.location.href = '/inventory';
                } else {
                    alert('Failed to purchase asset.');
                }
                $('#loading').hide();
            },
            error: function () {
                alert('Error! An error occurred. Please try again later.');
                $('#loading').hide();
            }
        });
    }
});