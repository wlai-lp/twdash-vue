<script setup>
import { onMounted, reactive, ref, watch, nextTick } from 'vue';
import { ProductService } from '@/service/ProductService';
import { TWDataService } from '@/service/TWDataService';
import { ExportDataService } from '@/service/ExportDataService';
import indexedDBManager from '@/service/indexDBService';
import { useLayout } from '@/layout/composables/layout';
import { useToast } from 'primevue/usetoast';
import TopLanguages from '@/components/TopLanguages.vue';
import ConfettiExplosion from "vue-confetti-explosion";

const visible = ref(false);
const explode = async () => {
    visible.value = false;
    await nextTick();
    visible.value = true;
};
const toast = useToast();
const onReply = () => {
    // toast.removeGroup('bc');
    const audio = new Audio('confettipop.mp3')
    audio.play();
    explode();
}

const onClose = () => {
    visible.value = false;
}


let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

// init indexdb
const indexdbInited = indexedDBManager.init();

const count = ref(0);
const batchCount = ref(0);
const batchTodayCount = ref(0);
const msgHisCallCount = ref(0);
const msgHisCallTodayCount = ref(0);
const attachmentCount = ref(0);
const attachmentTodayCount = ref(0);
const convoCount = ref(0);
const convoTodayCount = ref(0);
// const countTopUsage = ref(0);
const countTopUsage = reactive({
    message: 'Hello Vue!',
    count: '0',
    lang: 'abc'
});

const parentValue = ref(3);

const convoListData = ref(null);

const { isDarkTheme } = useLayout();
const calendarFromValue = ref('03/01/2024');
const calendarToValue = ref('03/31/2024');
const csat = ref(0);
const products = ref(null);
const twdata = ref(null);

const chartBarData = ref([15, 59, 80, 81, 56, 55, 90]);
const updateValue = () => {
    console.log("update chartbardata value")
    chartBarData.value = [75, 59, 80, 81, 26, 15, 10];
    parentValue.value += 1;
    // lineData.datasets[0].data = [55, 59, 80, 81, 56, 55, 40]
    // console.log("~ " + JSON.stringify(lineData))
};

const top4LanPieData = reactive({
    datasets: [
        {
            data: [11, 16, 7, 3],
            backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--orange-500')],
            label: 'My dataset'
        }
    ],
    labels: ['Indigo', 'Purple', 'Teal', 'Orange']
}

);

const top4LanPieOptions = reactive({
    plugins: {
        legend: {
            labels: {
                color: textColor
            }
        }
    },
    scales: {
        r: {
            grid: {
                color: surfaceBorder
            }
        }
    }
});


const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [15, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const lineOptions = ref(null);
const productService = new ProductService();
const twDataService = new TWDataService();
const exportDataService = new ExportDataService();
// exportDataService.getBatchData()
twDataService.setFromTimestamp((new Date('3/1/2024')).getTime());
twDataService.setToTimestamp((new Date('3/31/2024')).getTime());


async function updateWithNewData(data) {
    twdata.value = data

    //{"convoId":"c74575ed-a9cf-4ae3-b7da-3643042adca5","agentId":"4140456538"}

    console.log(JSON.stringify(twdata._rawValue.slice(0, 10)))
    const newValue = await exportDataService.getBatchData()
    // convoListData.value = twdata._rawValue.slice(0, 10);
    convoListData.value = newValue

    batchCount.value = await exportDataService.getBatchCount()

    // console.log(JSON.stringify(twdata._rawValue.slice(0, 10)))
    // count.value = twdata._rawValue.length;
    // count.value = twDataService.getTotalCount();
    count.value = data.length;
    // debugger;
    const d = twDataService.getTopNLanguages(1);
    countTopUsage.count = d[0][1];
    countTopUsage.lang = d[0][0];
    // debugger;

    // csat
    // TODO: this is mocked
    const randomNumber = Math.floor(Math.random() * (50 - 25 + 1)) + 25;
    if (randomNumber > 40) {
        // toast.add({ severity: 'success', summary: 'success', detail: 'High CSAT Achievement Unlocked', life: 3000 });

        toast.add({ severity: 'success', summary: 'High CSAT Achievement Unlocked', group: 'bc' });


        async () => {
            visible.value = false;
            await nextTick();
            visible.value = true;
        }

    }
    csat.value = randomNumber / 10


    chartBarData.value = [15, 29, 30, 81, 56, 55, 90];

    // console.log('change line data ' + lineData.value)
    lineData.datasets[0].data = [65, 59, 80, 81, 56, 55, 40]

    const top4LanPieDataResult = twDataService.getTop4LanPieData();
    top4LanPieData.datasets[0].data = top4LanPieDataResult.data
    top4LanPieData.labels = top4LanPieDataResult.labels

    toast.add({ severity: 'info', summary: 'info', detail: 'Dataset updated', life: 3000 });



}

onMounted(async () => {
    productService.getProductsSmall().then((data) => (products.value = data));
    // this is how you use ref, 
    // 1. you use ref(default value and assisgn to a const)
    // 2. you use variable.value = value to assign a proxy object value
    // 3. to reference in your temple, use {{ count }} , note not value, to get its value
    count.value = 123;
    // twDataService.getData().then((data) => (twdata.value = data));

    const twDataMonth = '022024'
    const data = await twDataService.getData(twDataMonth);
    updateWithNewData(data);
    // countTopUsage.value = twDataService.getTopNLanguages(1);    



    // twDataService.getData().then((data) => {
    //     // debugger;
    //     twdata.value = data
    //     convoListData.value = twdata._rawValue.slice(0, 10);
    //     console.log(JSON.stringify(twdata._rawValue.slice(0, 10)))
    //     // count.value = twdata._rawValue.length;
    //     count.value = twDataService.getTotalCount();

    // });

});

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);

watch(
    calendarFromValue,
    async (val) => {
        if (val instanceof Date) {

            const data = await twDataService.getUpdatedFrom(val.getTime());
            // debugger;
            updateWithNewData(data);
            // change the data
            // count.value = '234'          
        }

    },
    { immediate: true }
);

watch(
    calendarToValue,
    async (val) => {
        if (val instanceof Date) {
            const data = await twDataService.getUpdatedTo(val.getTime());
            // debugger;
            updateWithNewData(data);
        }
    },
    { immediate: true }
);

</script>

<template>
    <div>
        <!-- <button @click="explode">Show confetti</button> -->
        <ConfettiExplosion v-if="visible" />
    </div>
    <div class="grid">
        <!-- Date Range Picker -->
        <div class="col-12">
            <div class="card">
                <h5>Select Date Range</h5>
                <div class="grid p-fluid">
                    <div class="col-12 md:col-6">
                        <Calendar placeholder="From" :showIcon="true" :showButtonBar="true" v-model="calendarFromValue">
                        </Calendar>
                    </div>

                    <div class="col-12 md:col-6">
                        <Calendar placeholder="To" :showIcon="true" :showButtonBar="true" v-model="calendarToValue">
                        </Calendar>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Date Range Picker -->

        <!-- High level Card 1 -->
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Batch Count</span>
                        <div class="text-900 font-medium text-xl">{{ batchCount }} </div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-thumbs-up-fill text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ batchTodayCount }} </span>
                <span class="text-500"> today</span>
            </div>
        </div>
        <!-- End High Level Card 1 -->

        <!-- High Level Card 2 -->
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Msg Hist Calls Count</span>
                        <div class="text-900 font-medium text-xl">{{ msgHisCallCount }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-calculator text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ msgHisCallTodayCount }} </span>
                <span class="text-500"> today</span>
            </div>
        </div>
        <!-- End High Level Card 2 -->

        <!-- High Level card 3 -->
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Conversations</span>
                        <div class="text-900 font-medium text-xl">{{ convoCount }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comments text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ convoTodayCount }} </span>
                <span class="text-500"> today</span>
            </div>
        </div>
        <!-- End High Level Card 3 -->

        <!-- High Level Card 4 -->
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Attachments</span>
                        <div class="text-900 font-medium text-xl">{{ attachmentCount }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-cloud-download text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ attachmentTodayCount }} </span>
                <span class="text-500"> today</span>
            </div>
        </div>
        <!-- End High Level Card 4 -->

        <!-- convo table -->
        <div class="col-12">
            <div class="card">
                <h5>Last 10 Exports</h5>
                <DataTable :value="convoListData" tableStyle="min-width: 50rem">
                    <Column field="batch_run_id" header="Batch ID"></Column>
                    <Column field="start_timestamp" header="Start Time"></Column>
                    <Column field="stop_timestamp" header="Stop Time"></Column>
                    <Column field="param_from" header="From Time"></Column>
                    <Column field="param_to" header="To Time"></Column>
                    
                </DataTable>
            </div>
        </div>
        <!-- end convo table -->

        <!-- top4lan pie -->
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Top 4 Languages</h5>
                <Chart type="polarArea" :data="top4LanPieData" :options="top4LanPieOptions"></Chart>
            </div>
        </div>
        <!-- end top4lan pie -->

        <!-- line chart -->
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Overall CSAT (TODO12)</h5>
                <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
            </div>
        </div>
        <!-- end line chart -->



        <!-- playing -->
        <div class="col-12">
            <div class="card">
                <!-- <TopLanguages msg="Vite + Vue" :barData="chartBarData" /> -->
                <TopLanguages :chartBarData="chartBarData" />
            </div>
        </div>
        <!-- end playing -->


        <div class="card flex justify-content-center">
            <Toast position="top-center" group="bc" @close="onClose">
                <template #message="slotProps">
                    <div class="flex flex-column align-items-start" style="flex: 1">
                        <div class="flex align-items-center gap-2">
                            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                                shape="circle" />
                            <span class="font-bold text-900">MetaMask Bot</span>
                        </div>
                        <div class="font-medium text-lg my-3 text-900">{{ slotProps.message.summary }}</div>
                        <Button class="p-button-sm" label="Celebrate" @click="onReply()"></Button>
                    </div>
                </template>
            </Toast>
            <Button @click="showTemplate" label="View" />
        </div>


    </div>
</template>
