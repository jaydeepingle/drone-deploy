new DroneDeploy({version: 1}).then(function(api){
	console.log('app');
});

function handleClick() {
	const doc = new jsPDF()
	//to-do
	doc.save("doc.pdf")
}
