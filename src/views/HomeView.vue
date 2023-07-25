<script setup>
import { ref, onMounted } from "vue";
import Chart from 'primevue/chart';
//STORE
import { useUsersStore } from '../stores/user';
import { useTransactionsStore } from '../stores/transactions';
import { storeToRefs } from 'pinia';

const usersStore = useUsersStore();
const transactionsStore = useTransactionsStore();
const { availableCoins } = storeToRefs(transactionsStore);
const { user } = storeToRefs(usersStore);
const { getTransactions, getAvailableCoins } = transactionsStore;

const isDataFetched = ref(false);

onMounted(async () => {
  await getTransactions(user.value.userName);
  getAvailableCoins();
  console.log(availableCoins.value)
  getCryptoAmounts();
  chartData.value = setChartData();
});

const chartData = ref();
const chartOptions = ref({
  cutout: '60%',
  color: 'black',
  borderColor: 'black',
});



const formattedData = ref([]);
const getCryptoAmounts = () => {
  let i = 0;
  for (const crypto in availableCoins.value) {
    const label = crypto;
    const amount = availableCoins.value[crypto].crypto_amount
    const backgroundColor = rgbColors[i]
    const hoverColor = rgbHoverColors[i]
    formattedData.value.push({ label, amount, backgroundColor, hoverColor })
    i++;
  }

  formattedData.value = formattedData.value.filter((crypto) => crypto.amount !== 0);

}
const rgbColors = [
  "rgb(70, 130, 180)",    // Steel Blue
  "rgb(218, 165, 32)",    // Goldenrod
  "rgb(255, 69, 0)",      // Orange-Red
  "rgb(0, 128, 128)",     // Teal
  "rgb(220, 20, 60)",     // Crimson
  "rgb(32, 178, 170)",    // Light Sea Green
  "rgb(139, 69, 19)",     // Saddle Brown
  "rgb(128, 0, 0)",       // Maroon
  "rgb(46, 139, 87)",     // Sea Green
  "rgb(255, 140, 0)",     // Dark Orange
  "rgb(128, 0, 128)",     // Purple
  "rgb(0, 100, 0)",       // Dark Green
  "rgb(106, 90, 205)",    // Slate Blue
  "rgb(210, 105, 30)",    // Chocolate
  "rgb(144, 238, 144)",   // Light Green
  "rgb(128, 128, 0)",     // Olive
  "rgb(160, 82, 45)"      // Sienna
];

const rgbHoverColors = rgbColors.map((color) => {
  // Parse the RGB components from the color string
  const rgbValues = color.match(/\d+/g);
  const red = parseInt(rgbValues[0]);
  const green = parseInt(rgbValues[1]);
  const blue = parseInt(rgbValues[2]);

  // Increase each RGB component by 30 
  const whiteOffset = 30;
  const newRed = Math.min(red + whiteOffset, 255);
  const newGreen = Math.min(green + whiteOffset, 255);
  const newBlue = Math.min(blue + whiteOffset, 255);

  // Return the new color as "rgb(r, g, b)" string
  return `rgb(${newRed}, ${newGreen}, ${newBlue})`;
});

const setChartData = () => {
  return {
    labels: formattedData.value.map(crypto => crypto.label),
    datasets: [
      {
        data: formattedData.value.map(crypto => crypto.amount),
        backgroundColor: formattedData.value.map(crypto => crypto.backgroundColor),
        hoverBackgroundColor: formattedData.value.map(crypto => crypto.hoverColor),
        fontColor: 'white',
        
      }
    ]
  };
};

</script>

<template>
  <div class="cont">
    <div class="card flex justify-content-center">
      <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
    </div>
  </div>
</template>


