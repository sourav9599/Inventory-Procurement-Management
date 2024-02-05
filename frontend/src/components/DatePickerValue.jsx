import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DatePickerValue({ label, dateValue, setDateValue }) {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DemoContainer components={["DesktopDatePicker"]}>
				<DatePicker
					label={label}
					value={dateValue}
					onChange={(newValue) => setDateValue(newValue)}
				/>
			</DemoContainer>
		</LocalizationProvider>
	);
}
