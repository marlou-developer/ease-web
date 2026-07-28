import React, { useEffect, useState } from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    PDFViewer,
} from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import moment from "moment";
import peso_value from "@/app/lib/peso-value";
import store from "@/app/store/store";
import { get_pos_sales_by_id_thunk } from "@/app/redux/pos/pos-thunk";

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    logo: {
        width: "60%",
        height: 100, 
    },
    companyInfo: {
        textAlign: "right",
    },
    invoiceTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        backgroundColor: "#f0f0f0",
        fontWeight: "bold",
        padding: 5,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        padding: 5,
    },
    tableCol: {
        flex: 1,
        paddingHorizontal: 2,
    },
    notes_text: {
        marginTop: 24,
    },
    // Restored the missing notes style block
    notes: {
        marginTop: 24,
    },
    totalSection: {
        marginTop: 10,
        width: "32%",
        alignSelf: "flex-end",
    },
    totalRow: {
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bold: {
        fontWeight: "bold",
    },
    accountsBold: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
});

const InvoicesSection = () => {
    const { sale } = useSelector((state) => state.pos);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Mark that we are on the client-side
        setIsClient(true);
        
        if (typeof window !== "undefined") {
            const id = window.location.pathname.split("/")[4];
            if (id) {
                store.dispatch(get_pos_sales_by_id_thunk(id));
            }
        }
    }, []);

    // Return nothing during server-side rendering
    if (!isClient) {
        return null; 
    }

    return (
        <PDFViewer style={{ width: "100%", height: "100vh", border: "none" }}>
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image src="/images/logo.png" style={styles.logo} />
                        <View style={styles.companyInfo}>
                            <Text style={styles.invoiceTitle}>INVOICE</Text>
                            <Text># INVOICE-{sale?.invoice_no}</Text>
                        </View>
                    </View>

                    {/* Company Info */}
                    <View style={styles.section}>
                        <Text style={styles.bold}>Egie’s Beauty Boutique</Text>
                        <Text>Sacatel Bldg. V.Gustillo St. Brgy 5</Text>
                        <Text>San Carlos City, Negros Occidental 6127</Text>
                        <Text>Philippines</Text>
                    </View>

                    {/* Billing Info */}
                    <View style={styles.section}>
                        <Text>
                            Bill To:{" "}
                            <Text style={styles.bold}>
                                {sale?.customer?.name || "Guest"}
                            </Text>
                        </Text>
                        <Text>
                            Invoice Date: {" "}
                            {moment(sale?.created_at).format("LLL")}
                        </Text>
                        {sale?.due_date && (
                            <Text>
                                Due Date: {moment(sale?.due_date).format("LL")}
                            </Text>
                        )}
                    </View>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCol, { flex: 0.5 }]}>#</Text>
                        <Text style={[styles.tableCol, { fontWeight: "bold" }]}>
                            Item & Description
                        </Text>
                        <Text style={[styles.tableCol, { flex: 0.8 }]}>Qty</Text>
                        <Text style={[styles.tableCol, { flex: 0.8 }]}>Rate</Text>
                        <Text style={[styles.tableCol, { flex: 1 }]}>Amount</Text>
                    </View>

                    {/* Table Rows */}
                    {(sale?.sale_items || []).map((item, index) => {
                        return (
                            <View style={styles.tableRow} key={index}>
                                <Text style={[styles.tableCol, { flex: 0.5 }]}>
                                    {index + 1}
                                </Text>
                                <Text style={styles.tableCol}>
                                    {item.pos_product_stock?.product?.name}
                                </Text>
                                <Text style={[styles.tableCol, { flex: 0.8 }]}>
                                    {item.quantity}
                                </Text>
                                <Text style={[styles.tableCol, { flex: 0.8 }]}>
                                    {peso_value(Number(item.selling_price || item.fixed_price))}
                                </Text>
                                <Text style={[styles.tableCol, { flex: 1 }]}>
                                    {peso_value(Number(item.total))}
                                </Text>
                            </View>
                        );
                    })}

                    {/* Totals */}
                    <View style={styles.totalSection}>
                        <View style={styles.totalRow}>
                            <Text>Payment Status:</Text>
                            <Text> {sale?.status}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>Subtotal Price: </Text>
                            <Text>{peso_value(Number(sale?.sub_total || 0))}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>Discount Price: </Text>
                            <Text>
                                {peso_value(
                                    Number(sale?.customer_total_discount ?? 0) +
                                    Number(sale?.discount_per_item ?? 0) +
                                    Number(sale?.discount ?? 0)
                                )}
                            </Text>
                        </View>

                        <View
                            style={{
                                height: 1,
                                backgroundColor: "#000",
                                width: "100%",
                                marginTop: 5,
                                marginBottom: 5,
                            }}
                        />

                        <View style={styles.totalRow}>
                            <Text style={styles.bold}>Total: </Text>
                            <Text style={styles.bold}>
                                {/* Changed from total_price to total_amount to match your backend model */}
                                {peso_value(Number(sale?.total_amount || 0))}
                            </Text>
                        </View>
                    </View>

                    {/* Notes */}
                    <View>
                        <Text style={styles.notes_text}>Accounts:</Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={[
                                    styles.accountsBold,
                                    { marginRight: 30 },
                                ]}
                            >
                                BDO:{"\n"}
                                Glennie Doig{"\n"}
                                003080117454
                            </Text>
                            <Text style={styles.accountsBold}>
                                GCASH:{"\n"}
                                Glennie B.{"\n"}
                                09298788827
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.notes}>
                                Notes: Thanks for your business! We truly appreciate
                                your support and look forward to serving you again.
                            </Text>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default InvoicesSection;