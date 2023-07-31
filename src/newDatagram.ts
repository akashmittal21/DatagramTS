// import bootstrap from "bootstrap";
import mermaid from "mermaid";

function updateDatagram(mermaidStr: string) {
	(<HTMLElement> document.getElementById("graphDiv")).innerHTML = mermaidStr;
	(<HTMLElement>document.querySelector('#graphDiv')).removeAttribute('data-processed');
	mermaid.init(undefined, <HTMLElement>document.querySelector(".mermaid"));
};

function runMermaid() {
	mermaid.initialize({
		startOnLoad: true,
		flowchart: {
			useMaxWidth: true,
		},
		// zoomScale: Math.min(1, window.innerWidth / 1000),     // Not supported by Mermaid
	});

	// 
	mermaid.init(
		undefined,
		<HTMLElement>document.querySelector(".mermaid"),
		window.onload = function() {
			newDatagram()
		}
	);
};

async function postData(url = "", data = {}) {
	
	const response = await fetch(url, {
		method: "POST", 
		mode: "cors", 
		cache: "no-cache", 
		credentials: "same-origin", 
		headers: {
			"Content-Type": "application/json",		
		},
		redirect: "follow", 
		referrerPolicy: "no-referrer", 
		body: JSON.stringify(data),
	});
	
	return response.json(); 
};
	

function getCurrentTimestamp() {
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = String(now.getUTCMonth() + 1).padStart(2, "0");
	const day = String(now.getUTCDate()).padStart(2, "0");
	const hours = String(now.getUTCHours()).padStart(2, "0");
	const minutes = String(now.getUTCMinutes()).padStart(2, "0");
	const seconds = String(now.getUTCSeconds()).padStart(2, "0");
	
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function generatePopover(tableData: [string, string][]) {
	// let tableData = [];

	let popoverHtml: string = `
					<div class="popover-body-node-click">
				<ul class="nav nav-tabs" role="tablist">
					<li class="nav-item">
						<a class="nav-link active" data-toggle="tab" href="#request-tab" role="tab">Request</a>
					</li>
					<li class="nav-item">
						<a class="nav-link disabled" data-toggle="tab" href="#response-tab" role="tab">Response</a>
					</li>
				</ul>
				<div class="tab-content">
					<div class="tab-pane fade show active" id="request-tab" role="tabpanel">
						<div class="form-group-row">
							<div class="form-group form-inline">
							<label for="labelInput" class="mr-2">Label Name:</label>
							<input type="text" class="form-control" id="labelInput">
							</div>
							<div class="form-group form-inline">
							<label for="blockElement" class="mr-2">Block Element:</label>
							<select class="form-control" id="blockElement">
								<option value="" disabled selected>Please select a block</option>
								<option value="header">Header</option>
								<option value="body">Body</option>
								<option value="footer">Footer</option>
							</select>
							</div>
							<div class="form-group form-inline">
							<label for="categorySelect" class="mr-2">Category:</label>
							<select class="form-control" id="categorySelect">
								<option value="" disabled selected>Please select a category</option>
								<option value="openurl">OpenURL</option>
								<option value="displayactivepage">DisplayActivePage</option>
								<option value="settext">SetText</option>
								<option value="clickbutton">ClickButton</option>
								<option value="selectdropdown">SelectDropdown</option>
								<option value="crossverify">Crossverify</option>
								<option value="nottestedactionales">NotTestedActionables</option>
								<option value="executeapi">ExecuteAPI</option>
								<option value="other">Other</option>
							</select>
							</div>
						</div>
						<table class="table">
							<thead>
							<tr>
								<th scope="col">Attributes</th>
								<th scope="col">Values</th>
							</tr>
							</thead>
							<tbody>
							${tableData.map(row => `
							<tr>
								<td>${row[0]}</td>
								<td><input type="text" class="form-control" value="${row[1]}"></td>
							</tr>
							`).join("")}
							</tbody>
						</table>
					</div>
					<div class="tab-pane fade" id="response-tab" role="tabpanel">
						<div class="form-group-row">
							<div class="form-group form-inline">
							<label for="labelInput" class="mr-2">Label Name:</label>
							<input type="text" class="form-control" id="labelInput">
							</div>
							<div class="form-group form-inline">
							<label for="blockElement" class="mr-2">Block Element:</label>
							<select class="form-control" id="blockElement">
								<option value="" disabled selected>Please select a block</option>
								<option value="header">Header</option>
								<option value="body">Body</option>
								<option value="footer">Footer</option>
							</select>
							</div>
							<div class="form-group form-inline">
							<label for="categorySelect" class="mr-2">Category:</label>
							<select class="form-control" id="categorySelect">
								<option value="" disabled selected>Please select a category</option>
								<option value="openurl">OpenURL</option>
								<option value="image">image</option>
								<option value="settext">SetText</option>
								<option value="clickbutton">ClickButton</option>
								<option value="selectdropdown">SelectDropdown</option>
								<option value="crossverify">Crossverify</option>
								<option value="nottestedactionales">NotTestedActionables</option>
								<option value="executeapi">ExecuteAPI</option>
								<option value="other">Other</option>
							</select>
							</div>
						</div>
						<table class="table">
							<thead>
							<tr>
								<th scope="col">Attributes</th>
								<th scope="col">Values</th>
							</tr>
							</thead>
							<tbody>
							${tableData.map(row => `
							<tr>
								<td>${row[0]}</td>
								<td><input type="text" class="form-control" value="${row[1]}"></td>
							</tr>
							`).join("")}
							</tbody>
						</table>
					</div>
				</div>
				<div class="button-container">
					<button class="btn btn-sm btn-primary create-node-btn">Create Node</button>
					<button class="btn btn-sm btn-danger cancel-node-btn">Cancel</button>
				</div>
				</div>
				`;

	return popoverHtml
}; 

function newDatagram() {
	let bootstrap;
	let jsonData: any[] = [];
	let tableData: [string, string][] = [];
	let mermaidStr: string = `graph TD;`;
	(document.getElementById("graphDiv") as HTMLElement).innerHTML = mermaidStr;

	const createNodeBtn = document.getElementById('createNodeBtn') as HTMLButtonElement;
	const popoverContent = document.createElement("div") as HTMLDivElement;
	popoverContent.classList.add("popover-body-node-add-click");

	// Calling popver to get the html content that's to be displayed in the popup 
	popoverContent.innerHTML = generatePopover(tableData);

	const createNode = popoverContent.querySelector(".create-node-btn") as HTMLButtonElement;
	const createJsonBtn = document.querySelector("#create-json-btn") as HTMLButtonElement;
	const generateTestCasesBtn = document.getElementById("generate-test-btn") as HTMLButtonElement;
	const labelInput = popoverContent.querySelector("#labelInput") as HTMLInputElement; 
	const categorySelect = popoverContent.querySelector("#categorySelect") as HTMLSelectElement;
	const tableBody = popoverContent.querySelector('tbody') as HTMLTableSectionElement;
	const responseTab =  popoverContent.querySelector("#response-tab") as HTMLTableSectionElement;
	const responseNavLink = popoverContent.querySelector('a[data-toggle="tab"][href="#response-tab"]') as HTMLElement;
	const masterBlock = popoverContent.querySelector("#blockElement") as HTMLSelectElement;

	let pageCounter: number = 1;
	let elementCounter: number = 0;

	if (categorySelect) {
		// Add event listener to category select element
		categorySelect.addEventListener('change', function() {
			const selectedOption = categorySelect.value;
			const selectedLabel = labelInput.value;
			const blockValue = masterBlock.value;
			console.log(`Block ${blockValue}`)

			if (selectedOption === "settext" || selectedOption === "clickbutton" || selectedOption === "executeapi") {
				responseNavLink.classList.remove("disabled");
			} else {
				responseNavLink.classList.add("disabled");
			}
			

			// Update tableData based on selected option
			if (selectedOption === "crossverify") {
				tableData = [
					["Type", ""],
					["Execute", ""],
					["Properties_url", ""],
					["Properties_username", ""],
					["Properties_password", ""],
					["Properties_database", ""],
					["Properties_query", ""],
					["Match", ""],
					["Action", `${selectedOption}`],
					["WidgetName", ""],
					["Xpath", ""],
				];
			} else {
				tableData = [
					["Action", `${selectedOption}`],
					["Actionable", ""],
					["ActionableEvent", ""],
					["MasterBlock", `${blockValue}`],
					["BlockElement", ""],
					["Category", ""],
					["ClassName", ""],
					["Css", ""],
					["DynamicControl-check", ""],
					["Execute", ""],
					["Height", ""],
					["Id", `ai_p${pageCounter}_${elementCounter}`],
					["PageURL", ""],
					["Position_X", ""],
					["Position_Y", ""],
					["State", ""],
					["Value", ""],
					["WaitTime", ""],
					["WidgetName", `${selectedLabel}`],
					["Xpath", ""],
					["XpathRelative", ""],
					["BusinessLogic", ""],
					["Template", ""],
				];
			}


			// Re-render table
			tableBody.innerHTML = tableData.map(row => `
		<tr>
			<td style="width: 25%;">${row[0]}</td>
			<td style="width: 75%;"><input type="text" id="table_${row[0].toLowerCase()}" class="form-control" value="${row[1]}" style="height: 60%;"></td>
		  </tr>
		`).join("");
		});
	}

	createNode.addEventListener("click", function() {
		// Get the input values from the popover
		const labelInput = popoverContent.querySelector("#labelInput") as HTMLInputElement;
		const blockElement = popoverContent.querySelector("#blockElement") as HTMLSelectElement;
		const categorySelect = popoverContent.querySelector("#categorySelect") as HTMLSelectElement;

		const tableRows = Array.from(popoverContent.querySelectorAll("tbody tr")) as HTMLTableRowElement[];

		// Build the tableData array from the input values
		const tableData: [string, string][] = tableRows.map(row => [
			(row.querySelector("td:first-child") as HTMLTableCellElement).textContent || "",
			(row.querySelector("input") as HTMLInputElement).value
		]);

		// Loop through the table rows and add an event listener to the input elements
		tableRows.forEach(row => {
			const inputEl = row.querySelector("input") as HTMLInputElement;
			inputEl.addEventListener("input", function() {
				// Update the corresponding value in tableData
				const rowIndex = tableRows.indexOf(row);
				tableData[rowIndex][1] = inputEl.value;
			});
		});

		// Build the node string using the input values
		const nodeLabel: string = labelInput.value.trim();
		const block: string = blockElement.value;
		const category: string = categorySelect.value;
		const attributes: string = tableRows.map(row => `${(row.querySelector("td:first-child") as HTMLTableCellElement).textContent}:${(row.querySelector("input") as HTMLInputElement).value}`).join(",");

		const nodeObject = {
			general: {
				openurl: "",
				urlParamsKey: "",
				createdAt: getCurrentTimestamp(), // Add the current timestamp here
				creator: "AiTestPro",
				testcaseDesc: "",
				prerequisite: "OpenBrowser",
				testcaseGroup: "",
				project: {
				sprintVersion: "s1",
				sprintName: "s1.1",
				projectName: "",
				projectVersion: "1.1"
				},
				requirement: "NA",
				category: "web",
				version: "v2",
				softwareVersion: {
				serverVersion: "",
				appVersion: "",
				appName: "AiTestpro Plugin",
				serverName: "AiTestPro Server"
				}
			},
			name: nodeLabel,
			datasets: [{"request": [Object.fromEntries(tableData)], "response":[], "crossverify":[]}]
		};

		jsonData.push(nodeObject);
		const nodeString: string = `${nodeLabel};`;

		createNodeBtn.style.display = 'none';

		// Add the node to the Mermaid chart
		mermaidStr += `${nodeString}\n`;
		updateDatagram(mermaidStr);

		let counter = 0;
		renderGraph(mermaidStr, jsonData, counter, pageCounter, elementCounter);
		createJsonBtn.style.display = "block";

		// Hide the popover
		// popoverContent.hide();
		popoverContent.style.display = 'none';
	});

	const list = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
	list.map((el) => {
		let options: {} = {
			content: popoverContent,
			placement: 'right',
			html: true,
			
		}
		new bootstrap.Popover(el, options);
	});
}

function renderGraph(mermaidStr: string, jsonData: any[], counter: number, pageCounter: number, elementCounter: number) {
	// console.log(mermaidStr)
	let bootstrap;
	const edgePaths = document.querySelector(".edgePaths") as HTMLElement;
	const paths = edgePaths.querySelectorAll("path");

	const nodes = document.querySelector(".nodes") as HTMLElement;
	const nodeElements = Array.from(nodes.querySelectorAll(".node")) as HTMLElement[];

	paths.forEach((path) => {
		path.addEventListener("contextmenu", (event: Event) => {
			event.preventDefault();

			const classAttr = (<HTMLButtonElement>event.target).getAttribute("class");
			const [parent, child] = classAttr!.split(" ").filter((cls) => cls.startsWith("LE-") || cls.startsWith("LS-"));

			const parentId = parent.split("-")[1];
			const parentNode = nodes.querySelector(`[id*="-${parentId}-"]`) as HTMLElement;
			const parentLabel = parentNode.querySelector(".nodeLabel") as HTMLElement;
			const parentLabelText = parentLabel.innerHTML.replace(/<br>/g, "\\n");

			const childId = child.split("-")[1];
			const childNode = nodes.querySelector(`[id*="-${childId}-"]`) as HTMLElement;
			const childLabel = childNode.querySelector(".nodeLabel") as HTMLElement;
			const childLabelText = childLabel.innerHTML.replace(/<br>/g, "\\n");

			// Create the popover element
			const popover = document.createElement("div");
			popover.classList.add("popover");
			popover.innerHTML = `
					<div class="popover-body-edge-click">
					<div class="form-group">
						<label for="nodeTypeSelect">Node Type:</label>
						<select class="form-control" id="nodeTypeSelect">
						<option value="type1">Type 1</option>
						<option value="type2">Type 2</option>
						<option value="type3">Type 3</option>
						</select>
					</div>
					<div class="form-group">
						<label for="nodeLabelInput">Node Label:</label>
						<input type="text" class="form-control" id="nodeLabelInput">
					</div>
					<div class="form-group">
						<label for="tableInput">Table:</label>
						<input type="text" class="form-control" id="tableInput">
					</div>
					<button class="btn btn-sm btn-primary add-node-btn">Add Node</button>
					</div>
				`;

			const popoverInstance = new bootstrap.Popover(<HTMLElement>event.target, {
				container: "body",
				html: true,
				placement: "right",
				trigger: "manual",
				content: popover,
			});

			popoverInstance.show();

			const addNodeBtn = popover.querySelector(".add-node-btn") as HTMLButtonElement;
			addNodeBtn.addEventListener("click", () => {
				const nodeTypeSelect = document.querySelector("#nodeTypeSelect") as HTMLSelectElement;
				const nodeLabelInput = document.querySelector("#nodeLabelInput") as HTMLSelectElement;
				const tableInput = document.querySelector("#tableInput") as HTMLSelectElement;
				const nodeType = nodeTypeSelect.value;
				const nodeLabel = nodeLabelInput.value;
				const table = tableInput.value;
				if (nodeLabel !== null && table !== null) {
					const regex = `${parentId}(${parentLabelText}) --> ${childId}(${childLabelText});`;
					const newNodeId = `${nodeType}-${new Date().getTime()}`;
					const newNodeLabel = `${nodeLabel} (${table})`;
					mermaidStr = mermaidStr.replace(
						regex,
						`${parentId}(${parentLabelText}) --> ${newNodeId}("${newNodeLabel}"); ${newNodeId} --> ${childId}(${childLabelText});`
					);
					(<HTMLElement>document.getElementById("graphDiv")).innerHTML = mermaidStr;
				}
				(<HTMLElement>document.querySelector('#graphDiv')).removeAttribute('data-processed');
				mermaid.init(undefined, <HTMLElement>document.querySelector(".mermaid"));
				popoverInstance.hide();
			});
		});
	});


	nodeElements.forEach((nodeElement: HTMLElement) => {
		nodeElement.addEventListener("contextmenu", (event) => {
			event.preventDefault();

			const nodeId = nodeElement.id.split("-")[1];
			const nodeLabel = nodeElement.querySelector(".nodeLabel") as HTMLElement;
			const nodeText = nodeLabel.innerHTML.replace(/<br>/g, "\\n");

			const nodeStr = `${nodeId}(${nodeText})`;

			const mermaidArr = mermaidStr.split(nodeStr);
			const occurrences = mermaidArr.length - 1;

			const sentences: string[] = [];
			const lines = mermaidStr.split(/\r?\n/) as string[];

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];

				if (line.indexOf(nodeId) !== -1) {
					sentences.push(line);
				}
			}

			console.log(sentences);

			const popover = document.createElement("div");
			popover.classList.add("popover");
			popover.innerHTML = `
        <div class="popover-body-node-click">
          <button class="btn btn-sm btn-primary add-node-btn">Add</button>
          <button class="btn btn-sm btn-primary move-node-btn">Move</button>
          <button class="btn btn-sm btn-danger remove-node-btn">Remove</button>
        </div>
      `;

			const popoverInstance = new bootstrap.Popover(nodeElement, {
				container: "body",
				html: true,
				placement: "right",
				trigger: "manual",
				content: popover,
			});

			popoverInstance.show();

			const moveNodeBtn = popover.querySelector(".move-node-btn") as HTMLButtonElement;
			moveNodeBtn.addEventListener("click", () => {
				// TODO: Implement move node functionality
				popoverInstance.hide();
			});

			const removeNodeBtn = popover.querySelector(".remove-node-btn") as HTMLButtonElement;
			removeNodeBtn.addEventListener("click", () => {
				if (occurrences === 1) {
					mermaidStr = mermaidStr.replace(sentences[0], "");
					(<HTMLElement>document.getElementById("graphDiv")).innerHTML = mermaidStr;
				} else if (occurrences === 2) {
					for (let i = 0; i < sentences.length; i++) {
						mermaidStr = mermaidStr.replace(sentences[i], "");
					};
					console.log(`\n${sentences[0].split("-->")[0]} --> ${sentences[1].split("-->")[1]}`);
					mermaidStr += `\n${sentences[0].split("-->")[0]}-->${sentences[1].split("-->")[1]}`;
					(<HTMLElement>document.getElementById("graphDiv")).innerHTML = mermaidStr;
					
				}

				(<HTMLElement>document.querySelector('#graphDiv')).removeAttribute('data-processed');
				mermaid.init(undefined,(<HTMLElement> document.querySelector(".mermaid")));
	
				popoverInstance.hide();
			});

			const addNodeBtn = popover.querySelector(".add-node-btn") as HTMLButtonElement;
			
			addNodeBtn.addEventListener("click", () => {
				let tableData: [string, string][] = [];

				// Create new popover content with input, dropdown and table
				const popoverContent = document.createElement("div") as HTMLElement;
				popoverContent.classList.add("popover-body-node-add-click");
				popoverContent.innerHTML = generatePopover(tableData);
				const labelInput = popoverContent.querySelector("#labelInput") as HTMLInputElement;
				const responseNavLink = popoverContent.querySelector('a[data-toggle="tab"][href="#response-tab"]') as HTMLElement;


				// Replace the old popover content with the new content
				const popoverBody = popover.querySelector(".popover-body-node-click") as HTMLElement;
				(<HTMLElement>popoverBody.parentElement).replaceChild(popoverContent, popoverBody);

				// Create new popover content with input and dropdown
				const categorySelect = popover.querySelector("#categorySelect") as HTMLSelectElement;
				categorySelect.addEventListener("change", () => {
					const category = categorySelect.value;
					const selectedLabel = labelInput.value;
					const masterBlock = popoverContent.querySelector("#blockElement") as HTMLSelectElement;
					const blockValue = masterBlock.value;

					if (category === "selectdropdown" || category === "clickbutton" || category === "executeapi") {
						responseNavLink.classList.remove("disabled");
					} else {
						responseNavLink.classList.add("disabled");
					}
					

					if (category === "displayactivepage" || category === "openurl") {
						pageCounter ++;
						elementCounter = 0;
					}

					if (category === "crossverify") {
						tableData = [
							["type", ""],
							["execute", ""],
							["properties_url", ""],
							["properties_username", ""],
							["properties_password", ""],
							["properties_database", ""],
							["properties_query", ""],
							["match", ""],
							["action", `${category}`],
							["widgetName", ""],
							["xpath", ""],
						];
					} else {
						tableData = [
							["Action", `${category}`],
							["Actionable", ""],
							["ActionableEvent", ""],
							["MasterBlock", `${blockValue.charAt(0).toUpperCase() + blockValue.slice(1)}`],
							["BlockElement", ""],
							["Category", ""],
							["ClassName", ""],
							["Css", ""],
							["DynamicControl-check", ""],
							["Execute", ""],
							["Height", ""],
							["Id", `ai_p${pageCounter}_${elementCounter}`],
							["PageURL", ""],
							["Position_X", ""],
							["Position_Y", ""],
							["State", ""],
							["Value", ""],
							["WaitTime", ""],
							["WidgetName", `${selectedLabel}`],
							["Xpath", ""],
							["XpathRelative", ""],
							["BusinessLogic", ""],
							["Template", ""],
						];
					}
					// elementCounter ++;
					// Refresh the table
					const tbody = popoverContent.querySelector("tbody") as HTMLTableSectionElement;
					tbody.innerHTML = tableData.map(row => `
            <tr>
              <td style="width: 25%;">${row[0]}</td>
              <td style="width: 75%;"><input type="text" class="form-control" value="${row[1]}" style="height: 60%;"></td>
            </tr>
          `).join("");
				});

				// Add event listener to the create-node button
				const createNodeBtn = popoverContent.querySelector(".create-node-btn") as HTMLButtonElement;
				createNodeBtn.addEventListener("click", () => {
					const labelInput = (<HTMLInputElement>popoverContent.querySelector("#labelInput")).value;
					const categorySelect = (<HTMLInputElement>popoverContent.querySelector("#categorySelect")).value;
					const tableRows = Array.from(popoverContent.querySelectorAll("tbody tr")) as HTMLTableRowElement[];

					// Build the tableData array from the input values
					const tableData = tableRows.map(row => [(row.querySelector("td:first-child") as HTMLTableCellElement).textContent, (row.querySelector("input") as HTMLInputElement).value]);

					// Loop through the table rows and add an event listener to the input elements
					tableRows.forEach(row => {
						const inputEl = row.querySelector("input") as HTMLInputElement;
						inputEl.addEventListener("input", function() {
							// Update the corresponding value in tableData
							const rowIndex = tableRows.indexOf(row);
							tableData[rowIndex][1] = inputEl.value;
						});
					});
					let nodeObject;

					nodeObject = {
						general: {
							openurl: "",
							urlParamsKey: "",
							createdAt: getCurrentTimestamp(), // Add the current timestamp here
							creator: "AiTestPro",
							testcaseDesc: "",
							prerequisite: nodeId,
							testcaseGroup: "",
							project: {
							sprintVersion: "s1",
							sprintName: "s1.1",
							projectName: "dgsms_test",
							projectVersion: "1.1"
							},
							requirement: "NA",
							category: "web",
							version: "v2",
							softwareVersion: {
							serverVersion: "",
							appVersion: "",
							appName: "AiTestpro Plugin",
							serverName: "AiTestPro Server"
							}
						},
						name: labelInput,
						datasets: [{"request": [Object.fromEntries(tableData)], "response":[], "crossverify":[]}]
					};

					if (categorySelect == "displayactivepage") {
						jsonData.push(nodeObject)
						counter++;
					} else if (categorySelect == "crossverify") {
						let dataset = {"request": [], "response":[], "crossverify":[Object.fromEntries(tableData)]};
						jsonData[counter].datasets.push(dataset);
					} else {
						let dataset = {"request": [Object.fromEntries(tableData)], "response":[], "crossverify":[]};
						jsonData[counter].datasets.push(dataset);
					}

					// Do something with the label and category values
					if (labelInput !== null) {
						// const regex = `${parentId}(${parentLabelText}) --> ${childId}(${childLabelText});`;
						// const newNodeLabel = `${nodeLabel} (${table})`;
						// Adding subgraphs for clustering form elements together
						// if (categorySelect == "settext" || categorySelect == "clickbutton"){
						// 	mermaidStr += `subgraph ${pageCounter}[FormElement];\nstyle ${pageCounter} fill:white,stroke:green,stroke-width:2px,color:white,font-size:9px,align:lef;\n`;
						// }
						mermaidStr += `${nodeId} --> ${labelInput};`
						console.log(nodeId)
						// exiting the subgraph
						// if (categorySelect == "settext" || categorySelect == "clickbutton"){
						// 	mermaidStr += "end;\n"
						// }
						// document.getElementById("graphDiv").innerHTML = mermaidStr;
					}
					const generateWebBtn = document.querySelector("#generate-web-btn") as HTMLButtonElement;
					generateWebBtn.style.display = "block";

					const generateTestCasesBtn = document.querySelector("#generate-test-btn") as HTMLButtonElement;
					generateTestCasesBtn.style.display = "block";

					updateDatagram(mermaidStr);
					elementCounter ++;
          			renderGraph(mermaidStr, jsonData, counter, pageCounter, elementCounter);
					// $('#graphDiv').removeAttr('data-processed');
					// mermaid.init(undefined, document.querySelector(".mermaid"));
					// const nodeLabelInput = document.querySelector("#nodeLabelInput");
					// const nodeLabel = nodeLabelInput.value;
					popoverInstance.hide();
				});

				const myDialog = document.getElementById("my-dialog") as HTMLDialogElement;
				const dialogTitle = document.getElementById("dialog-title") as HTMLElement;
				const dialogBody = document.getElementById("dialog-body") as HTMLElement;
				const dialogActionBtn = document.getElementById("dialog-action-btn") as HTMLButtonElement;

				document.addEventListener("click", function (event) {
				const target = event.target as HTMLElement;

				if (target.classList.contains("open-dialog-btn")) {
					myDialog.show();

					const buttonId = target.id;

					if (buttonId === "create-json-btn") {
					dialogTitle.textContent = "Enter file name:";
					dialogBody.innerHTML = `
						<input type="text" id="file-name-input" style="width: 260px;">
					`;
					dialogActionBtn.textContent = "OK";
					dialogActionBtn.removeEventListener("click", generateTemplateHandler);
					dialogActionBtn.addEventListener("click", createJSONHandler);
					} else if (buttonId === "generate-web-btn") {
					dialogTitle.textContent = "Enter Project Name:";
					dialogBody.innerHTML = `
						<input type="text" id="project-name-input" style="width: 260px;">
					`;
					dialogActionBtn.textContent = "OK";
					dialogActionBtn.removeEventListener("click", createJSONHandler);
					dialogActionBtn.addEventListener("click", generateTemplateHandler);
					}
				}
				});

				function createJSONHandler() {
				const fileNameInput = document.getElementById("file-name-input") as HTMLInputElement;
				const fileName = fileNameInput.value.trim();

				if (!fileName) {
					alert("Please enter a file name.");
					return;
				}

				const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
				const downloadLink = document.createElement("a");
				downloadLink.href = URL.createObjectURL(jsonBlob);
				downloadLink.download = fileName + ".json";
				downloadLink.click();

				myDialog.close();
				}

				function generateTemplates(projectName) {
				return postData("https://apitracer.aitestpro.com/api/generateWebPro", {
					url: "",
					project: projectName,
					data: jsonData
				});
				}

				function generateTemplateHandler() {
				const projectNameInput = document.getElementById("project-name-input") as HTMLInputElement;
				const projectName = projectNameInput.value.trim();

				if (!projectName) {
					alert("Please enter a project name.");
					return;
				}

				generateTemplates(projectName).then((response) => {
					const downloadLink = document.createElement("a");
					downloadLink.href = response.data;
					downloadLink.click();

					alert("Project generated successfully!");
				});

				myDialog.close();
				}

				myDialog.addEventListener("cancel", function () {
				myDialog.close();
				});


				// Event listener for Generate Test Cases Button. NOTE: Currently no api provided for generating Test Cases 
				const generateTestCasesBtn = document.getElementById("generate-test-btn") as HTMLButtonElement;
				generateTestCasesBtn.addEventListener("click", function() {
					console.log("Test cases being generated")
				});

				

				// Add event listener to cancel button
				const cancelBtn = popoverContent.querySelector(".cancel-node-btn") as HTMLButtonElement;
				cancelBtn.addEventListener("click", () => {
					// Reset the form and hide the popover
					const labelInput = popoverContent.querySelector("#labelInput") as HTMLInputElement;
					const categorySelect = popoverContent.querySelector("#categorySelect") as HTMLSelectElement;
					labelInput.value = "";
					categorySelect.value = "default";
					popoverInstance.hide();
				});
			});
		});
	});
}


let versionNo = "1.1"
runMermaid();

// if there is an action request needs to have a response related to that action.