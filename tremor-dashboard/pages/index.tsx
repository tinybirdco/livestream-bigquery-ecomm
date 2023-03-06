import {
  Card,
  Title,
  Tab,
  TabList,
  ColGrid,
  Col,
  BarChart,
  AreaChart,
  BarList,
  DonutChart,
  TextInput,
  Dropdown,
  DropdownItem,
  Flex
} from '@tremor/react';

import { useState, useEffect } from 'react';

const host = 'api.tinybird.co';

export default function Example() {

  const [selectedView, setSelectedView] = useState(1);
  const [token, setToken] = useState('p.eyJ1IjogImZjZTA2MjBmLTI2ZDAtNGUwNi05MjdhLTFmN2EyZDQwMDI4MSIsICJpZCI6ICJkY2I5M2EyNi01MjE5LTQxMmUtOTc1NS0xNzM2ZWRhYTY4ZjUifQ.3UvVNzluKEYl5nlZ9Cwfn7PYXj67k3P9zndHzIugLH8')
  const [hourlySales, setHourlySales] = useState([]);
  const [top5, settop5] = useState([]);
  const [salesUTM, setSalesUTM] = useState([]);
  const [hourlySalesStore, setHourlySalesStore] = useState([]);
  const [family, setFamily] = useState('All');

  let apiHourlySales = `https://${host}/v0/pipes/hourly_sales.json?token=${token}&family_param=${family}`;
  let apitop5 = `https://${host}/v0/pipes/top_5_prods.json?token=${token}&family_param=${family}`;
  let apiSalesUTM = `https://${host}/v0/pipes/sales_by_utm.json?token=${token}&family_param=${family}`;
  let apiHourlyStore = `https://${host}/v0/pipes/hourly_sales_by_store.json?token=${token}&family_param=${family}`;

  const fetchTinybirdUrl = async (fetchUrl: string, setState: Function) => {
    console.log(fetchUrl);
    const data = await fetch(fetchUrl)
    const jsonData = await data.json();
    setState(jsonData.data);
  };

  useEffect(() => {
    fetchTinybirdUrl(apiHourlySales, setHourlySales)
  }, [apiHourlySales]);
  useEffect(() => {
    fetchTinybirdUrl(apitop5, settop5)
  }, [apitop5]);
  useEffect(() => {
    fetchTinybirdUrl(apiSalesUTM, setSalesUTM)
  }, [apiSalesUTM]);
  useEffect(() => {
    fetchTinybirdUrl(apiHourlyStore, setHourlySalesStore)
  }, [apiHourlyStore]);

  const dollarFormatter = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString();
  };

  const numberFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
  };

  return (
      <main className="bg-slate-50 p-6 sm:p-10">

          <Title>eCommerce Dashboard</Title>

          <Flex justifyContent="justify-between" marginTop="mt-4">
              <TextInput
                  value= {token}
                  onChange={ (event) => setToken(event.target.value) }
                  placeholder="Enter auth token"
                  maxWidth="max-w-sm"
                  marginTop="mt-0"
              />
              <Dropdown
                  value={family}
                  onValueChange={ (event) => setFamily(event) }
                  placeholder="Select..."
                  maxWidth="max-w-sm"
                  marginTop="mt-0"
              >
                  <DropdownItem
                      value={ "All" }
                      text="All"
                  />
                  <DropdownItem
                      value={ "Jacket" }
                      text="Jacket"
                  />
                  <DropdownItem
                      value={ "Shirt" }
                      text="Shirt"
                  />
                  <DropdownItem
                      value={ "Sweatshirt" }
                      text="Sweatshirt"
                  />
              </Dropdown>
          </Flex>

          <TabList defaultValue={ 1 } handleSelect={ (value) => setSelectedView(value) } marginTop="mt-6">
              <Tab value={ 1 } text="Sales" />
              <Tab value={ 2 } text="Marketing" />
          </TabList>

          { selectedView === 1 ? (
              <>
                  <ColGrid numCols={ 3 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
                      <Col numColSpan={ 2 }>
                          <Card>
                              <Title>Sales Trend</Title>
                              <AreaChart
                                  data={hourlySales}
                                  categories={["total_sales"]}
                                  dataKey="hour"
                                  colors={["emerald"]}
                                  valueFormatter={numberFormatter}
                                  height="h-80"
                              />
                          </Card>
                      </Col>
                      <Card>
                          <Title>Top 5 Products by Revenue</Title>
                          <BarList 
                              data={top5}
                              valueFormatter={dollarFormatter}
                              color="sky"
                              marginTop='mt-4'
                          />
                      </Card>
                  </ColGrid>
              </>
          ) : (
                  <ColGrid numCols={ 3 } gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
                      <Card>
                          <Title>Sales by UTM</Title>
                          <DonutChart
                              data={salesUTM}
                              category="total_sales"
                              dataKey="utm_source"
                              colors={[ "fuchsia", "blue", "rose", "yellow" ]}
                              variant="donut"
                              valueFormatter={numberFormatter}
                              height="h-60"
                          />
                      </Card>
                      <Col numColSpan={ 2 }>
                          <Card>
                              <Title>Sales Trend by Store</Title>
                              <BarChart
                                  data={hourlySalesStore}
                                  categories={["store_1","store_2","store_3","store_4","store_5","store_6"]}
                                  dataKey="hour"
                                  colors={["red","orange","amber","green","sky","purple"]}
                                  valueFormatter={numberFormatter}
                                  stack={true}
                                  height="h-80"
                              />
                          </Card>
                      </Col>
                  </ColGrid>
          ) }
      </main>
  );
}