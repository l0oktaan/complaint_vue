<!-- <template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template> -->
<template>
  <div>
    <object :data="pdfUrl" type="application/pdf" width="100%" height="600"></object>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pdfBlob: null,
      pdfUrl: '',
    }
  },
  mounted() {
    // Fetch the PDF document as a blob
    fetch('/path/to/my/document.pdf')
      .then(response => response.blob())
      .then(blob => {
        this.pdfBlob = blob;

        // Create an object URL for the PDF blob
        this.pdfUrl = URL.createObjectURL(blob);
      })
      .catch(error => console.error(error));
  },
  beforeDestroy() {
    // Clean up by revoking the object URL
    URL.revokeObjectURL(this.pdfUrl);
  }
}
</script>
