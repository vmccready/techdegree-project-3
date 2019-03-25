
//define variables
const $otherTitle = $('#other-title');
const $title = $('#title');
const $color = $('#color');
const $colorPlaceholder = $('<option disabled selected hidden>Please select a T-shirt theme</option>');
const $colorPlaceholder2 = $('<option value="2" disabled hidden>Please select a color</option>');
const $design = $('#design');
const $activities = $('.activities label')
let totalCost = 0;
const $totalCost = $("<label id='totalCost'>Total Cost: $<span>0</span></label>");
const $payment = $('#payment');
const $creditCard = $('#credit-card');
const $paypal = $creditCard.next();
const $bitcoin = $paypal.next();
const $registerButton = $('button');

//set up page on load
$('#name').focus();
$otherTitle.hide();
$color.children().hide();
$color.prepend($colorPlaceholder2);
$color.prepend($colorPlaceholder);
$design.children().first().prop('disabled', true);
$design.children().first().prop('hidden', true);
$color.parent().hide();
$('.activities').append($totalCost);
$('#payment option').eq(1).prop('selected', true);
$('#payment option').eq(0).prop('hidden', true);
$paypal.hide();
$bitcoin.hide();

// Show other job input field if 'other' job option selected
$title.on('change', function() {
    if ($title.val() === 'other') {
        $otherTitle.show();
    } else {
        $otherTitle.hide();
    }
});

// Only show colors for specific design
$design.on('change', function() {
    let regex;
    if($design.val() === 'js puns') {
        regex = /(JS Puns)/;
    } else if ($design.val() === 'heart js') {
        regex = /(JS shirt)/;
    } else {regex = /none/}
    if (regex !== /none/) {$color.parent().show();
    } else {$color.parent().show()}
    $color.children().each(function() {
        if(regex.test($(this).text())){
            $(this).show();
        } else {
            $(this).hide();
        }
    });
    $color.val('2');
})


// Update activities when one is selected
$('.activities').on('change', function(event) {
    const text = $(event.target).parent().text(); // target text

    function updateCheckboxes(regex, checked) {
        if(regex.test(text)) { //check if workshop is at same time as target workshop
            $activities.each(function(index, element) {
                const $input = $($(element).children()[0]);
                if (regex.test(element.textContent) && !$input.prop('checked')) {
                    $input.prop('disabled', checked);
                }
            })
        } 
    }

    //see if we are checking or unchecking the box to show or hide
    if ($(event.target).prop('checked')){
        updateCheckboxes(/9am/, true);
        updateCheckboxes(/1pm/, true);
    } else {
        updateCheckboxes(/9am/, false); 
        updateCheckboxes(/1pm/, false); 
    }

    //update cost
    totalCost = 0;
    $activities.each(function(index, element) {
        const $input = $($(element).children()[0]);
        if ($input.prop('checked')) {
            totalCost += 100;
            if ($input.attr('name') === 'all') {
                totalCost += 100;
            }
        }
    })
    $('#totalCost span').text(totalCost);
});

$payment.on('change', function(event) {
    $payment.nextAll().hide();
    const paymentMethod = event.target.value;
    if (paymentMethod === 'credit card') {
        $creditCard.show();
    } else if (paymentMethod === 'paypal') {
        $paypal.show();
    } else if (paymentMethod === 'bitcoin') {
        $bitcoin.show();
    }

});

let validated = false;

$registerButton.on('click', function(event) {
    event.preventDefault();
    const nameRegex = /^\w+$/i;
    // email regex from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    console.log(nameRegex.test($('#name').val()));
    console.log(emailRegex.test($('#mail').val()));
    console.log($('.activities input').prop('checked'));

    if (nameRegex.test($('#name').val()) &&         //validate name
        emailRegex.test($('#mail').val()) &&        //validate email
        $('.activities input').prop('checked') &&   //validate activities
        paymentValidated()) {                       //validate payment
        $('form')[0].submit();
    }
});

function paymentValidated() {
    const ccRegex = /\d{13,16}/;
    const zipRegex = /\d{5}/;
    const cvvRegex = /\d{3}/;

    if ($payment.val() !== 'credit card') {
        return true;
    } else {
        return(ccRegex.test($('#cc-num').val()) &&
                zipRegex.test($('#zip').val()) &&
                cvvRegex.test($('#cvv').val()))
    }
}






