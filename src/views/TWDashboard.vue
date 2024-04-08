<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { ProductService } from '@/service/ProductService';
import { TWDataService } from '@/service/TWDataService';
import { useLayout } from '@/layout/composables/layout';
// import HelloWorld from '@/views/twreportuikit/HelloWorld'
import HelloWorld from '@/components/HelloWorld.vue';
import TopLanguages from '@/components/TopLanguages.vue';


const count = ref(0);
// const countTopUsage = ref(0);
const countTopUsage = reactive({
  message: 'Hello Vue!',
  count: '0',
  lang: 'abc'
});

const convoListData = ref(null);

const { isDarkTheme } = useLayout();
const calendarFromValue = ref('02/01/2024');
const calendarToValue = ref('02/29/2024');
const products = ref(null);
const twdata = ref(null);
const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
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

onMounted(async () => {
    productService.getProductsSmall().then((data) => (products.value = data));
    // this is how you use ref, 
    // 1. you use ref(default value and assisgn to a const)
    // 2. you use variable.value = value to assign a proxy object value
    // 3. to reference in your temple, use {{ count }} , note not value, to get its value
    count.value = 123;
    // twDataService.getData().then((data) => (twdata.value = data));

    const data = await twDataService.getData();
    twdata.value = data
    convoListData.value = twdata._rawValue.slice(0, 10);
    console.log(JSON.stringify(twdata._rawValue.slice(0, 10)))
    // count.value = twdata._rawValue.length;
    count.value = twDataService.getTotalCount();
    // debugger;
    const d = twDataService.getTopNLanguages(1);
    countTopUsage.count = d[0][1];
    countTopUsage.lang = d[0][0];
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
    (val) => {
        console.log("value changed to " + val)
        // change the data
        count.value = '234'
    },
    { immediate: true }
);

</script>

<template>
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
                        <span class="block text-500 font-medium mb-3">Conversations</span>
                        <div class="text-900 font-medium text-xl">{{ count }} </div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">24 new </span>
                <span class="text-500">this month</span>
            </div>
        </div>
        <!-- End High Level Card 1 -->

        <!-- High Level Card 2 -->
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Top Usage</span>
                        <div class="text-900 font-medium text-xl">{{ countTopUsage.count }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ countTopUsage.lang }} </span>
                <span class="text-500"> this month</span>
            </div>
        </div>
        <!-- End High Level Card 2 -->

        <!-- High Level card 3 -->
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">CSAT</span>
                        <div class="text-900 font-medium text-xl">4.3</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">4.6 </span>
                <span class="text-500">this month</span>
            </div>
        </div>
        <!-- End High Level Card 3 -->

        <!-- High Level Card 4 -->
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total Time</span>
                        <div class="text-900 font-medium text-xl">1520 minutes</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">85 </span>
                <span class="text-500">this month</span>
            </div>
        </div>
        <!-- End High Level Card 4 -->

        <!-- convo table -->
        <div class="col-12">
            <div class="card">
                <h5>Last 10 Conversations</h5>
                <DataTable :value="convoListData" tableStyle="min-width: 50rem">
                    <Column field="convoId" header="Convo ID"></Column>
                    <Column field="agentId" header="Agent ID"></Column>
                    <Column field="language" header="Language">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <img alt="flag" src="/demo/images/flag/flag_placeholder.png"
                                    :class="`flag flag-${data.language}`" style="width: 24px" />
                                <span>{{ data.language }}</span>
                            </div>
                        </template>
                    </Column>
                    <!-- <Column field="timestamp" header="timestamp"></Column> -->
                    <!-- <Column field="date" header="Date"></Column> -->
                    <Column field="dateTime" header="Time"></Column>
                </DataTable>
            </div>
        </div>
        <!-- end convo table -->

        <!-- playing -->
        <div class="col-12">
            <div class="card">
                <TopLanguages msg="Vite + Vue" />
            </div>
        </div>
        <!-- end playing -->


    </div>
</template>
