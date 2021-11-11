import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { ProductService } from '../service/ProductService';
import { CustomerService } from '../service/CustomerService';

export const AllOrder = () => {

    const [customer1, setCustomer1] = useState(null);
    const [customer2, setCustomer2] = useState(null);
    const [customer3, setCustomer3] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [globalFilter1, setGlobalFilter1] = useState('');
    const [globalFilter2, setGlobalFilter2] = useState('');
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [products, setProducts] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        const customerService = new CustomerService();
        const productService = new ProductService();
        productService.getProductsWithOrdersSmall().then(data => setProducts(data));
        customerService.getCustomersMedium().then(data => { setCustomer1(data); setLoading1(false) });
        customerService.getCustomersMedium().then(data => { setCustomer2(data); setLoading2(false) });
        customerService.getCustomersMedium().then(data => setCustomer3(data));
    }, []);

    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    };

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    };

    const expandAll = () => {
        let _expandedRows = {}
        products.forEach(p => _expandedRows[`${p.id}`] = true);

        setExpandedRows(_expandedRows);
        toast.current.show({ severity: 'success', summary: 'All Rows Expanded', life: 3000 });
    };

    const collapseAll = () => {
        setExpandedRows(null);
        toast.current.show({ severity: 'success', summary: 'All Rows Collapsed', life: 3000 });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const calculateCustomerTotal = (name) => {
        let total = 0;

        if (customer3) {
            for (let customer of customer3) {
                if (customer.representative.name === name) {
                    total++;
                }
            }
        }

        return total;
    }

    const customer1TableHeader = (
        <div className="table-header">
            List of All Orders
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter1} onChange={(e) => setGlobalFilter1(e.target.value)} placeholder="Search here" />
            </span>
        </div>
    );

    const customer2TableHeader = (
        <div className="table-header">
            List of Customers
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter2} onChange={(e) => setGlobalFilter2(e.target.value)} placeholder="Global Search" />
            </span>
        </div>
    );

    const bodyTemplate = (data, props) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                {data[props.field]}
            </>
        );
    };

    const PhoneIconBodyTemplate = (data) => {
        return (
            <>
                <Button icon="pi pi-phone" className="p-button-rounded p-button-success" />
                {/* <img src="assets/demo/images/flags/flag_placeholder.png" alt={data.country.name} className={`flag flag-${data.country.code}`} width={30} height={20} /> */}
                {/* <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.country.name}</span> */}
            </>
        );
    };

    const EmailIconBodyTemplate = (data) => {
        return (
            <>
                <Button icon="pi pi-envelope" className="p-button-rounded" />
                {/* <img src="assets/demo/images/flags/flag_placeholder.png" alt={data.country.name} className={`flag flag-${data.country.code}`} width={30} height={20} /> */}
                {/* <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.country.name}</span> */}
            </>
        );
    };

    const ActionIconBodyTemplate = (data) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-info mx-2" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" />
            </>
        );
    };

    const representativeBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Representative</span>
                <img alt={data.representative.name} src={`assets/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.representative.name}</span>
            </>
        );
    };

    const statusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`customer-badge status-${data.status}`}>{data.status}</span>
            </>
        )
    };

    const activityBody = (data) => {
        return (
            <>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={data.activity} showValue={false} />
            </>
        )
    };

    const actionTemplate = () => <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>;

    const productsTableHeader = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="mr-2" />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
        </div>
    );

    const imageBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${data.image}`} alt={data.image} className="product-image" />
            </>
        );
    };

    const priceBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(data.price)}
            </>
        );
    };

    const reviewsBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={data.rating} readonly cancel={false} />
            </>
        );
    };

    const productStatusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
            </>
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders}>
                    <Column field="id" header="Id" sortable body={bodyTemplate}></Column>
                    <Column field="customer" header="Customer" sortable body={bodyTemplate}></Column>
                    <Column field="date" header="Date" sortable body={bodyTemplate}></Column>
                    <Column field="amount" header="Amount" sortable body={bodyTemplate}></Column>
                    <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                    <Column headerStyle={{ width: '4rem' }} body={() => <Button icon="pi pi-search" />}></Column>
                </DataTable>
            </div>
        );
    };

    const headerRowGroup = (data) => {
        return (
            <>
                <img alt={data.representative.name} src={`assets/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.representative.name}</span>
            </>
        );
    };

    const footerRowGroup = (data) => {
        return (
            <>
                <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Customers:</strong></td>
                <td><strong>{calculateCustomerTotal(data.representative.name)}</strong></td>
            </>
        )
    };

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <h5>All Orders</h5>
                    {/* <p>Pagination, sorting, filtering and checkbox selection.</p> */}
                    <DataTable value={customer1} paginator className="p-datatable-customers" rows={10} dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={(e) => setSelectedCustomers(e.value)}
                        globalFilter={globalFilter1} emptyMessage="No customers found." loading={loading1} header={customer1TableHeader}>
                        <Column field="srno" header="Sr No" sortable body={bodyTemplate}></Column>
                        <Column field="name" header="Name" sortable body={bodyTemplate}></Column>
                        <Column field="date" header="Date" sortable body={bodyTemplate}></Column>
                        <Column field="invoice" header="Invoice ID" sortable body={bodyTemplate}></Column>
                        <Column field="sitename" header="Site" sortable body={bodyTemplate}></Column>
                        <Column field="phone" header="Phone" sortable body={PhoneIconBodyTemplate}></Column>
                        <Column field="email" header="Email" sortable body={EmailIconBodyTemplate}></Column>
                        <Column field="price" header="Total Amount" sortable body={bodyTemplate}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column field="action" header="Action" sortable body={ActionIconBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    )
}
