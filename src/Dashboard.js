import React, {useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';
import './Dashboard.css';


const OrderDashboard = ({productInfo, orderInfo, orderDetailInfo}) => {
        const chartRefs = [
            useRef(null),
            useRef(null),
            useRef(null),
            useRef(null),
            useRef(null),
            useRef(null)
        ];

        useEffect(() => {
            if (orderInfo.loading || orderDetailInfo.loading || productInfo.loading) return;

            // Get aggregated data
            const aggregatedData_product_month     = aggregateDataByProductAndMonth(orderInfo.orders, orderDetailInfo.order_details);
            const aggregatedData_sourcerev_month   = aggregateDataBySourceRevAndMonth(orderInfo.orders, orderDetailInfo.order_details);
            const aggregatedData_sourcesales_month = aggregateDataBySourceSalesAndMonth(orderInfo.orders, orderDetailInfo.order_details);
            const aggregatedData_quantity_month    = aggregateDataByQuantityAndMonth(orderInfo.orders, orderDetailInfo.order_details);

            // Define the id of each chart
            const chart_id = {
                bar_for_sales_over_time:      0,
                line_for_sales_over_time:     1,
                bar_for_rev_over_time:        2,
                line_for_rev_over_time:       3,
                bar_for_srcsales_over_time:   4,
                bar_for_srcrev_over_time:     5,
            }

            // Prepare data for Chart.js
            const months = Array.from(new Set(Object.values(aggregatedData_product_month).flatMap(product => Object.keys(product)))).sort()
            const all_datasets = {
                line_for_rev_over_time:     Object.keys(aggregatedData_product_month).map(product => ({
                                                label: `${product}`,
                                                data: months.map(month => aggregatedData_product_month[product][month] ? aggregatedData_product_month[product][month] : 0),
                                                borderColor: randomColor(),
                                                tension: 0.1
                                            })),
                bar_for_rev_over_time:      Object.keys(aggregatedData_product_month).map(product => ({
                                                label: `${product}`,
                                                data: months.map(month => aggregatedData_product_month[product][month] ? aggregatedData_product_month[product][month] : 0),
                                                backgroundColor: randomColor()
                                            })),
                bar_for_srcrev_over_time:   Object.keys(aggregatedData_sourcerev_month).map(source => ({
                                                label: `${source}`,
                                                data: months.map(month => aggregatedData_sourcerev_month[source][month] ? aggregatedData_sourcerev_month[source][month] : 0),
                                                backgroundColor: randomColor()
                                            })),
                bar_for_srcsales_over_time: Object.keys(aggregatedData_sourcesales_month).map(source => ({
                                                label: `${source}`,
                                                data: months.map(month => aggregatedData_sourcesales_month[source][month] ? aggregatedData_sourcesales_month[source][month] : 0),
                                                backgroundColor: randomColor()
                                            })),
                line_for_sales_over_time:   Object.keys(aggregatedData_quantity_month).map(product => ({
                                                label: `${product}`,
                                                data: months.map(month => aggregatedData_quantity_month[product][month] ? aggregatedData_quantity_month[product][month] : 0),
                                                borderColor: randomColor(),
                                                tension: 0.1
                                            }))
            }

            const sumOfAllProducts = months.map(month => Object.values(aggregatedData_product_month).reduce((acc, curr) => acc + (curr[month] || 0), 0));
            all_datasets['line_for_rev_over_time'].push({
                label: '總和',
                data: sumOfAllProducts,
                borderColor: 'black',
                tension: 0.1,
                borderDash: [5, 5] // Optional: add dashed line style
            });

            all_datasets['bar_for_sales_over_time'] = all_datasets['line_for_sales_over_time'].map(dataset => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: randomColor()
            }))

            // Plot charts
            const revenueLine = new Chart(chartRefs[chart_id['line_for_rev_over_time']].current, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: all_datasets['line_for_rev_over_time']
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: '各產品銷售額隨月份變化折趨勢圖'
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const revenueBar = new Chart(chartRefs[chart_id['bar_for_rev_over_time']].current, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: all_datasets['bar_for_rev_over_time']
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: '各產品銷售額比較'
                        },
                    }
                }
            });

            const sourcerevBar = new Chart(chartRefs[chart_id['bar_for_srcrev_over_time']].current, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: all_datasets['bar_for_srcrev_over_time']
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: '各廣告通路產生銷售額比較'
                        }
                    }
                }
            });

            const sourcesalesBar = new Chart(chartRefs[chart_id['bar_for_srcsales_over_time']].current, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: all_datasets['bar_for_srcsales_over_time']
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: '各廣告通路產生之銷量比較'
                        }
                    }
                }
            });

            const salesLine = new Chart(chartRefs[chart_id['line_for_sales_over_time']].current, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: all_datasets['line_for_sales_over_time']
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: '各產品銷量隨月份變化趨勢圖'
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const salesBar = new Chart(chartRefs[chart_id['bar_for_sales_over_time']].current, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: all_datasets['bar_for_sales_over_time']
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: '各產品銷量比較'
                        },
                    }
                }
            });

            return () => {
                revenueLine.destroy();
                revenueBar.destroy();
                sourcerevBar.destroy();
                sourcesalesBar.destroy();
                salesLine.destroy();
                salesBar.destroy();
            };

        }, [orderInfo.loading, orderInfo.loading, orderDetailInfo.loading]);

        const aggregateDataByProductAndMonth = (orders, orderDetails) => {
            const aggregatedData = {};

            // Iterate over orderDetails and aggregate revenue by product and month
            orderDetails.forEach(detail => {
                try {
                    const orderId = detail.order_id;
                    const product = productInfo.products.find(product => product.product_id === detail.product_id).name;
                    const dt = new Date(orders.find(order => order.order_id === orderId).order_date);
                    const month = String(dt.getMonth() + 1);
                    const year = dt.getFullYear();
                    const key = `${year}-${month.padStart(2, '0')}`;

                    if (!aggregatedData[product]) {
                        aggregatedData[product] = {};
                    }

                    if (aggregatedData[product][key]) {
                        aggregatedData[product][key] += detail.subtotal; // Assuming you have a revenue property
                    } else {
                        aggregatedData[product][key] = detail.subtotal; // Assuming you have a revenue property
                    }
                } catch (e) {
                    console.log("an error occurred while searching for the items: ", e);
                }
            });

            const months = Array.from(new Set(Object.values(aggregatedData).flatMap(product => Object.keys(product))));

            // Fill in missing months with 0 revenue for each product
            Object.keys(aggregatedData).forEach(product => {
                months.forEach(month => {
                    if (!aggregatedData[product][month]) {
                        aggregatedData[product][month] = 0;
                    }
                });
            });

            return aggregatedData;
        };

        const aggregateDataBySourceRevAndMonth = (orders, orderDetails) => {
            const aggregatedData = {};

            // Iterate over orderDetails and aggregate revenue by product and month
            orderDetails.forEach(detail => {
                const orderId = detail.order_id;
                const source = orders.find(order => order.order_id === orderId).source
                const dt = new Date(orders.find(order => order.order_id === orderId).order_date);
                const month = String(dt.getMonth() + 1);
                const year = dt.getFullYear();
                const key = `${year}-${month.padStart(2, '0')}`;

                if (!aggregatedData[source]) {
                    aggregatedData[source] = {};
                }

                if (aggregatedData[source][key]) {
                    aggregatedData[source][key] += detail.subtotal; // Assuming you have a revenue property
                } else {
                    aggregatedData[source][key] = detail.subtotal; // Assuming you have a revenue property
                }
            });

            const months = Array.from(new Set(Object.values(aggregatedData).flatMap(source => Object.keys(source))));

            // Fill in missing months with 0 for each source
            Object.keys(aggregatedData).forEach(source => {
                months.forEach(month => {
                    if (!aggregatedData[source][month]) {
                        aggregatedData[source][month] = 0;
                    }
                });
            });

            return aggregatedData;
        };

        const aggregateDataBySourceSalesAndMonth = (orders, orderDetails) => {
            const aggregatedData = {};

            // Iterate over orderDetails and aggregate revenue by product and month
            orderDetails.forEach(detail => {
                const orderId = detail.order_id;
                const source = orders.find(order => order.order_id === orderId).source
                const dt = new Date(orders.find(order => order.order_id === orderId).order_date);
                const month = String(dt.getMonth() + 1);
                const year = dt.getFullYear();
                const key = `${year}-${month.padStart(2, '0')}`;

                if (!aggregatedData[source]) {
                    aggregatedData[source] = {};
                }

                if (aggregatedData[source][key]) {
                    aggregatedData[source][key] += detail.quantity; // Assuming you have a revenue property
                } else {
                    aggregatedData[source][key] = detail.quantity; // Assuming you have a revenue property
                }
            });

            const months = Array.from(new Set(Object.values(aggregatedData).flatMap(source => Object.keys(source))));

            // Fill in missing months with 0 for each source
            Object.keys(aggregatedData).forEach(source => {
                months.forEach(month => {
                    if (!aggregatedData[source][month]) {
                        aggregatedData[source][month] = 0;
                    }
                });
            });

            return aggregatedData;
        };

        const aggregateDataByQuantityAndMonth = (orders, orderDetails) => {
            const aggregatedData = {};

            // Iterate over orderDetails and aggregate revenue by product and month
            orderDetails.forEach(detail => {
                try {
                    const orderId = detail.order_id;
                    const product = productInfo.products.find(product => product.product_id === detail.product_id).name;
                    const quantity = detail.quantity;
                    const dt = new Date(orders.find(order => order.order_id === orderId).order_date);
                    const month = String(dt.getMonth() + 1);
                    const year = dt.getFullYear();
                    const key = `${year}-${month.padStart(2, '0')}`;

                    if (!aggregatedData[product]) {
                        aggregatedData[product] = {};
                    }

                    if (aggregatedData[product][key]) {
                        aggregatedData[product][key] += quantity; // Assuming you have a revenue property
                    } else {
                        aggregatedData[product][key] = quantity; // Assuming you have a revenue property
                    }
                } catch (e) {
                    console.log("an error occurred while searching for the items: ", e);
                }
            });

            const months = Array.from(new Set(Object.values(aggregatedData).flatMap(product => Object.keys(product))));

            // Fill in missing months with 0 revenue for each product
            Object.keys(aggregatedData).forEach(product => {
                months.forEach(month => {
                    if (!aggregatedData[product][month]) {
                        aggregatedData[product][month] = 0;
                    }
                });
            });

            return aggregatedData;
        };

        const randomColor = () => {
            return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
        };

        return (
            <div className='chartContainer'>
                <div className='emptyBox' style={{height: "50px"}}></div>
                {chartRefs.map(ref => (
                    <div>
                        <canvas ref={ref} width="400" height="200"></canvas>
                        <div className='emptyBox'></div>
                    </div>
                ))}
            </div>
        );
    }
;

export default OrderDashboard;
