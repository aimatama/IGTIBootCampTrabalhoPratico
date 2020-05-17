window.addEventListener('load', start);

function start() {
  //preventFormSubmit();
  activateInput();
}

// function preventFormSubmit() {
//   function handleSubmit(event) {
//     event.preventDefault();
//   }

//   var form = document.querySelector('form');
//   form.addEventListener('submit', handleSubmit);
// }

function activateInput() {
  var txtRedNumber = document.querySelector('#txtRedNumber');
  var txtGreenNumber = document.querySelector('#txtGreenNumber');
  var txtBlueNumber = document.querySelector('#txtBlueNumber');
  var txtStartField = txtRedNumber;

  txtStartField.focus();

  txtRedNumber.addEventListener('change', handleOnChange);
  txtGreenNumber.addEventListener('change', handleOnChange);
  txtBlueNumber.addEventListener('change', handleOnChange);
}

function handleOnChange(event) {
  AlterColorFieldLabel();
  changeBackgroundColor();

  function AlterColorFieldLabel() {
    var txtcolorField = event.target;
    var nameColorFieldLabel = '#' + txtcolorField.name + 'Label';
    var txtcolorFieldLabel = document.querySelector(nameColorFieldLabel);
    txtcolorFieldLabel.value = txtcolorField.value;
  }

  function changeBackgroundColor() {
    var styleDefined = identifySelectedColor();
    var colorBackground = document.querySelector('#colorBackground');
    colorBackground.style = styleDefined;

    function identifySelectedColor() {
      var txtRedNumberLabel = document.querySelector('#txtRedNumberLabel');
      var txtGreenNumberLabel = document.querySelector('#txtGreenNumberLabel');
      var txtBlueNumberLabel = document.querySelector('#txtBlueNumberLabel');
      var styleDefined =
        'background-color:rgb(' +
        txtRedNumberLabel.value +
        ',' +
        txtGreenNumberLabel.value +
        ',' +
        txtBlueNumberLabel.value +
        ');';
      return styleDefined;
    }
  }
}
