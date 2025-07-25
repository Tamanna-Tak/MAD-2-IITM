export default {
    template: `<div>
      <h1 style="color:purple; text-align:center">Welcome Manager</h1>
      </br></br>
      <button class="btn btn-primary" style="color:white; font-size:20px; position: absolute; right: 20px;" @click="download">
      <i class="fa fa-download"></i> Download Product Details
    </button>
      <span style="color:green" v-if="isWaiting">Waiting.....</span>
    </div>`,
    data() {
      return {
        isWaiting: false,
        downloadCompleted: false, // New property to track download completion
        intervalId: null, // Variable to hold the interval ID
      };
    },
    methods: {
      async download() {
        this.isWaiting = true;
        const res = await fetch('/download-csv');
        const data = await res.json();
        if (res.ok) {
          const taskId = data["task-id"];
          this.intervalId = setInterval(async () => {
            const csv_res = await fetch(`/get-csv/${taskId}`);
            if (csv_res.ok) {
              this.isWaiting = false;
              clearInterval(this.intervalId);
              window.location.href = `/get-csv/${taskId}`;
              if (!this.downloadCompleted) {
                this.downloadCompleted = true;
                alert('Download Completed!');
              }
            }
          }); 
        }
      },
    },
  };
  