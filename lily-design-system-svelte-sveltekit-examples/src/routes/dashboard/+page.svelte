<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Badge from "$lib/components/Badge.svelte";
    import Banner from "$lib/components/Banner.svelte";
    import Progress from "$lib/components/Progress.svelte";
    import ProgressCircle from "$lib/components/ProgressCircle.svelte";
    import Meter from "$lib/components/Meter.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import DataTableHead from "$lib/components/DataTableHead.svelte";
    import DataTableBody from "$lib/components/DataTableBody.svelte";
    import DataTableRow from "$lib/components/DataTableRow.svelte";
    import DataTableTD from "$lib/components/DataTableTD.svelte";
    import SummaryList from "$lib/components/SummaryList.svelte";
    import SummaryListItem from "$lib/components/SummaryListItem.svelte";
    import Sparkline from "$lib/components/Sparkline.svelte";
    import Notification from "$lib/components/Notification.svelte";
    import Skeleton from "$lib/components/Skeleton.svelte";
    import Separator from "$lib/components/Separator.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import BackLink from "$lib/components/BackLink.svelte";

    const patients = [
        { name: "Alice Johnson", age: 34, status: "Active", ward: "A1" },
        { name: "Bob Smith", age: 67, status: "Discharged", ward: "B3" },
        { name: "Carol Williams", age: 45, status: "Active", ward: "A2" },
        { name: "David Brown", age: 52, status: "Pending", ward: "C1" },
    ];
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Dashboard</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <Banner type="info">
        <strong>System update:</strong> Scheduled maintenance tonight at 22:00.
    </Banner>

    <Notification label="New notification">
        <p>3 new patient records require review.</p>
    </Notification>

    <h2>Overview</h2>

    <div
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: var(--nhs-space-4);"
    >
        <Card heading="Total Patients" headingLevel={3}>
            <p
                style="font-size: var(--nhs-font-size-36); font-weight: 700; margin: 0;"
            >
                247
            </p>
            <Badge type="success">+12 this week</Badge>
        </Card>

        <Card heading="Bed Occupancy" headingLevel={3}>
            <Progress label="Bed occupancy" value={78} max={100} />
            <p style="margin-top: var(--nhs-space-1);">78% occupied</p>
        </Card>

        <Card heading="Wait Time" headingLevel={3}>
            <Meter
                label="Average wait time"
                value={35}
                min={0}
                max={60}
                low={15}
                high={45}
                optimum={10}
            />
            <p style="margin-top: var(--nhs-space-1);">35 minutes avg</p>
        </Card>

        <Card heading="Satisfaction" headingLevel={3}>
            <p
                style="font-size: var(--nhs-font-size-36); font-weight: 700; margin: 0;"
            >
                4.2/5
            </p>
            <Badge type="info">Last 30 days</Badge>
        </Card>
    </div>

    <Separator />

    <h2>Patient Records</h2>

    <DataTable label="Patient records" caption="Recent patient activity">
        <DataTableHead>
            <DataTableRow>
                <th>Name</th>
                <th>Age</th>
                <th>Status</th>
                <th>Ward</th>
            </DataTableRow>
        </DataTableHead>
        <DataTableBody>
            {#each patients as patient}
                <DataTableRow>
                    <DataTableTD>{patient.name}</DataTableTD>
                    <DataTableTD>{patient.age}</DataTableTD>
                    <DataTableTD>
                        <Badge
                            type={patient.status === "Active"
                                ? "success"
                                : patient.status === "Pending"
                                  ? "warning"
                                  : "default"}
                        >
                            {patient.status}
                        </Badge>
                    </DataTableTD>
                    <DataTableTD>{patient.ward}</DataTableTD>
                </DataTableRow>
            {/each}
        </DataTableBody>
    </DataTable>

    <Separator />

    <h2>Summary</h2>

    <SummaryList label="Dashboard summary">
        <SummaryListItem term="Total admissions">
            <span>142</span>
        </SummaryListItem>
        <SummaryListItem term="Total discharges">
            <span>128</span>
        </SummaryListItem>
        <SummaryListItem term="Emergency cases">
            <span>23</span>
        </SummaryListItem>
        <SummaryListItem term="Average stay">
            <span>4.2 days</span>
        </SummaryListItem>
    </SummaryList>

    <Separator />

    <h2>Trends</h2>

    <div
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: var(--nhs-space-4);"
    >
        <Card heading="Admissions" headingLevel={3}>
            <Sparkline label="Weekly admissions">
                <svg
                    viewBox="0 0 100 30"
                    width="100%"
                    height="30"
                    role="img"
                    aria-label="Weekly admissions trend"
                >
                    <polyline
                        fill="none"
                        stroke="var(--nhs-blue)"
                        stroke-width="2"
                        points="0,25 15,20 30,22 45,15 60,18 75,10 100,12"
                    />
                </svg>
            </Sparkline>
        </Card>

        <Card heading="Wait Times" headingLevel={3}>
            <Sparkline label="Weekly wait times">
                <svg
                    viewBox="0 0 100 30"
                    width="100%"
                    height="30"
                    role="img"
                    aria-label="Weekly wait times trend"
                >
                    <polyline
                        fill="none"
                        stroke="var(--nhs-orange)"
                        stroke-width="2"
                        points="0,10 15,15 30,12 45,20 60,18 75,25 100,22"
                    />
                </svg>
            </Sparkline>
        </Card>
    </div>

    <Separator />

    <h2>Loading States</h2>
    <div
        style="display: flex; flex-direction: column; gap: var(--nhs-space-2); max-width: 400px;"
    >
        <Skeleton />
        <Skeleton />
        <Skeleton />
    </div>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Dashboard Example</p>
    </div>
</Footer>
