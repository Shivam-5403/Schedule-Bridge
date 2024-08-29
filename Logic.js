$(document).ready(function () {
    console.log("Page is ready, sending AJAX request.");

    $.ajax({
        url: "/login",
        method: "POST",
        contentType: "application/json",
        success: function (result) {
            console.log("Received response from server: ", result);
            $("#add-new-cards").html(result.html);
        },
        error: function (err) {
            console.log("Error in AJAX request: ", err);
        }
    });
});
