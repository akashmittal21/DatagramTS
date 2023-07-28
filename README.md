# Description of the flow

- 809 - runMermaid() - starts the program and calls the function at line 7
runMermaid() - initialize mermaid so that the flowchart can be rendered

- 20 - newDatagram() - This will start the actual generation for the datagram

- 187, 527 - generatePopover() - This returns the html string that will be to used for the content inside the popup

- 303, 633 - getCurrentTimestamp() - This return the timestamp string which will be used for project details

- 335, 690 - updateDatagram() - This will re-render the datagram after user adds a node as changes are made to mermaidStr

- 338, 692 - renderGraph() - This funtion allows the user to add nodes to the already existing flowchart

- 702 - Event Listener to generate JSON File for the datagram that has been created by the user. Currently asks the user to input for file name.

- 745 - Event Listener to generate Template zip file based on the datagram. Currently asks the user to input the file name.

- 765 - postData() - This function calls the API providied by siddish to generate the Templates.
It takes two inputs 1.The URL 2. Object containing url, project and data
Available on line 25

- 785 - Event Listener to genereate Test cases for the datagram. Currently doesn't have a working API.
