import SelectableTable from "./tabel-data";
import InventoryTopbar from "./topbar";

export default function Page() {
  return (
    <div>
      {/* make komponen topbar */}
      <InventoryTopbar />
      <main>
        {/* nu ieu mah make shadcn.io asal pake wae hela */}
        <SelectableTable />
      </main>
    </div>
  );
}
