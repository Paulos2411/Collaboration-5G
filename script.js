let packetData = [];

// Upload PCAP file
function uploadPcap() {
    const fileInput = document.getElementById('pcapFile');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        packetData = data.data;
        alert('File uploaded successfully!');
    })
    .catch(error => {
        console.error('Error uploading file:', error);
        alert('Error uploading file.');
    });
}

// Visualize data
function visualizeData() {
    fetch('http://localhost:5001/visualize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: packetData })
    })
    .then(response => response.json())
    .then(data => {
        const visualizationResult = document.getElementById('visualizationResult');
        visualizationResult.textContent = `Visualization Data: ${data.visualization_data.join(', ')}`;
    })
    .catch(error => {
        console.error('Error visualizing data:', error);
        alert('Error visualizing data.');
    });
}

// Detect anomalies
function detectAnomalies() {
    fetch('http://localhost:5001/detect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: packetData })
    })
    .then(response => response.json())
    .then(data => {
        const anomalyResult = document.getElementById('anomalyResult');
        anomalyResult.textContent = `Detection Message: ${data.message}, Anomalies: ${data.anomalies.join(', ')}`;
    })
    .catch(error => {
        console.error('Error detecting anomalies:', error);
        alert('Error detecting anomalies.');
    });
}
