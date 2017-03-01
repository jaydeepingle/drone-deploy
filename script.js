new DroneDeploy({version: 1}).then(function(api){
  console.log('DroneDeploy Api: ', api);
	html2canvas(document.getElementById('sample'), {
	    useCORS: true,
	    onrendered: function (canvas) {
	        var data = canvas.toDataURL();
	        var docDefinition = {
	            content: [{
	                image: data,
	                width: 500,
	            }]
	        };
	        pdfMake.createPdf(docDefinition).download("Map.pdf");
	    }
	});
});



