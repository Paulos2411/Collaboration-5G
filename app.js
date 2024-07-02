const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Define the backend URL
const backend_url = 'http://localhost:5001';

// Upload PCAP file
async function upload_pcap(file_path) {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file_path));
        
        const response = await axios.post(`${backend_url}/upload`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });
        
        return response.data;
    } catch (e) {
        console.error(`Error uploading file: ${e}`);
        return {};
    }
}

// Visualize Data
async function visualize_data(data) {
    try {
        const response = await axios.post(`${backend_url}/visualize`, { data: data });
        return response.data;
    } catch (e) {
        console.error(`Error visualizing data: ${e}`);
        return {};
    }
}

// Detect Anomalies
async function detect_anomalies(data) {
    try {
        const response = await axios.post(`${backend_url}/detect`, { data: data });
        return response.data;
    } catch (e) {
        console.error(`Error detecting anomalies: ${e}`);
        return {};
    }
}

// Example usage:
const file_path = '/Users/paulo.-p./Documents/Studium/TUM/Semester 2/Data Innovation Lab/normal_traffic.pcap';

(async () => {
    // Upload the PCAP file
    const upload_response = await upload_pcap(file_path);
    const packet_data = upload_response.data || [];

    if (packet_data.length > 0) {
        // Visualize the data
        const visualization_response = await visualize_data(packet_data);
        const visualization_data = visualization_response.visualization_data || [];
        console.log('Visualization Data:', visualization_data);

        // Detect anomalies
        const detection_response = await detect_anomalies(packet_data);
        const message = detection_response.message || '';
        const anomalies = detection_response.anomalies || [];
        console.log('Detection Message:', message);
        console.log('Anomalies:', anomalies);
    } else {
        console.log("No packet data returned.");
    }
})();
