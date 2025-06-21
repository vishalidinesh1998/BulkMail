const fileinput = document.getElementById("fileInput");

fileinput.addEventListener("change", function(event) {
  const file = event.target.files[0];

  const reader = new FileReader();

  reader.onload = function(event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    console.log(workbook);
  };

  reader.readAsBinaryString(file);
});
