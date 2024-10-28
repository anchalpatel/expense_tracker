export function formatDate(dateString) {
  //console.log("PRINTING DATE : ", dateString)
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('en-UK', options);
    return formatter.format(date);
  }
  

  