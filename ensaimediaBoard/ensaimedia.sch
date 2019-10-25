EESchema Schematic File Version 4
LIBS:ensaimedia-cache
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L ensaimedia-rescue:CY7C68013A-56PVX-MCU_Cypress U1
U 1 1 5D0D69B6
P 6600 3550
F 0 "U1" H 6600 5728 50  0000 C CNN
F 1 "CY7C68013A-56PVX" H 6600 5637 50  0000 C CNN
F 2 "Package_SO:SSOP-56_7.5x18.5mm_P0.635mm" H 6600 1250 50  0001 C CNN
F 3 "http://www.cypress.com/file/138911/download" H 6600 3750 50  0001 C CNN
	1    6600 3550
	1    0    0    -1  
$EndComp
Wire Wire Line
	6400 1550 6600 1550
$Comp
L ensaimedia-rescue:+3V3-power #PWR0101
U 1 1 5D0D745D
P 7200 1450
F 0 "#PWR0101" H 7200 1300 50  0001 C CNN
F 1 "+3V3" H 7215 1623 50  0000 C CNN
F 2 "" H 7200 1450 50  0001 C CNN
F 3 "" H 7200 1450 50  0001 C CNN
	1    7200 1450
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:+3V3-power #PWR0102
U 1 1 5D0D74BD
P 9400 4650
F 0 "#PWR0102" H 9400 4500 50  0001 C CNN
F 1 "+3V3" H 9415 4823 50  0000 C CNN
F 2 "" H 9400 4650 50  0001 C CNN
F 3 "" H 9400 4650 50  0001 C CNN
	1    9400 4650
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:GND-power #PWR0103
U 1 1 5D0D776E
P 10500 1900
F 0 "#PWR0103" H 10500 1650 50  0001 C CNN
F 1 "GND" H 10505 1727 50  0000 C CNN
F 2 "" H 10500 1900 50  0001 C CNN
F 3 "" H 10500 1900 50  0001 C CNN
	1    10500 1900
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:GND-power #PWR0104
U 1 1 5D0D779C
P 10500 3400
F 0 "#PWR0104" H 10500 3150 50  0001 C CNN
F 1 "GND" H 10505 3227 50  0000 C CNN
F 2 "" H 10500 3400 50  0001 C CNN
F 3 "" H 10500 3400 50  0001 C CNN
	1    10500 3400
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:Conn_01x12_Male-Connector J10
U 1 1 5D0D7A9D
P 10200 2450
F 0 "J10" H 10172 2330 50  0000 R CNN
F 1 "-" H 10172 2421 50  0000 R CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x12_P2.54mm_Vertical" H 10200 2450 50  0001 C CNN
F 3 "~" H 10200 2450 50  0001 C CNN
	1    10200 2450
	-1   0    0    1   
$EndComp
$Comp
L ensaimedia-rescue:Conn_01x12_Male-Connector J11
U 1 1 5D0D7C66
P 10200 3950
F 0 "J11" H 10172 3830 50  0000 R CNN
F 1 "-" H 10172 3921 50  0000 R CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x12_P2.54mm_Vertical" H 10200 3950 50  0001 C CNN
F 3 "~" H 10200 3950 50  0001 C CNN
	1    10200 3950
	-1   0    0    1   
$EndComp
$Comp
L ensaimedia-rescue:Conn_01x12_Male-Connector J12
U 1 1 5D0D7CA8
P 10200 5450
F 0 "J12" H 10172 5330 50  0000 R CNN
F 1 "-" H 10172 5421 50  0000 R CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x12_P2.54mm_Vertical" H 10200 5450 50  0001 C CNN
F 3 "~" H 10200 5450 50  0001 C CNN
	1    10200 5450
	-1   0    0    1   
$EndComp
Wire Wire Line
	10500 1900 10500 1850
Wire Wire Line
	10500 1850 10000 1850
Wire Wire Line
	10500 3400 10500 3350
Wire Wire Line
	10500 3350 10000 3350
NoConn ~ 10000 1950
Wire Wire Line
	9400 4650 9400 4850
$Comp
L ensaimedia-rescue:Conn_01x02_Female-Connector J2
U 1 1 5D0D84C2
P 3250 1350
F 0 "J2" H 3100 1100 50  0000 L CNN
F 1 "POWER" H 3050 1450 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 3250 1350 50  0001 C CNN
F 3 "~" H 3250 1350 50  0001 C CNN
	1    3250 1350
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:VBUS-power #PWR0105
U 1 1 5D0D871E
P 2950 1250
F 0 "#PWR0105" H 2950 1100 50  0001 C CNN
F 1 "VBUS" H 2965 1423 50  0000 C CNN
F 2 "" H 2950 1250 50  0001 C CNN
F 3 "" H 2950 1250 50  0001 C CNN
	1    2950 1250
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:+5V-power #PWR0106
U 1 1 5D0D8756
P 2650 1250
F 0 "#PWR0106" H 2650 1100 50  0001 C CNN
F 1 "+5V" H 2665 1423 50  0000 C CNN
F 2 "" H 2650 1250 50  0001 C CNN
F 3 "" H 2650 1250 50  0001 C CNN
	1    2650 1250
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:USB_B_Micro-Connector J1
U 1 1 5D0D8C41
P 4550 3850
F 0 "J1" H 4605 4317 50  0000 C CNN
F 1 "USB_B_Micro" H 4605 4226 50  0000 C CNN
F 2 "Connector_USB:USB_Micro-B_Wuerth_629105150521_CircularHoles" H 4700 3800 50  0001 C CNN
F 3 "~" H 4700 3800 50  0001 C CNN
	1    4550 3850
	1    0    0    -1  
$EndComp
NoConn ~ 4850 4050
$Comp
L ensaimedia-rescue:R-Device R2
U 1 1 5D0D9549
P 5300 4500
F 0 "R2" H 5370 4546 50  0000 L CNN
F 1 "2K2" H 5370 4455 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 5230 4500 50  0001 C CNN
F 3 "~" H 5300 4500 50  0001 C CNN
	1    5300 4500
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:R-Device R1
U 1 1 5D0D9A29
P 4800 2850
F 0 "R1" H 4870 2896 50  0000 L CNN
F 1 "100K" H 4870 2805 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 4730 2850 50  0001 C CNN
F 3 "~" H 4800 2850 50  0001 C CNN
	1    4800 2850
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:+3V3-power #PWR0107
U 1 1 5D0DA07E
P 4800 2600
F 0 "#PWR0107" H 4800 2450 50  0001 C CNN
F 1 "+3V3" H 4815 2773 50  0000 C CNN
F 2 "" H 4800 2600 50  0001 C CNN
F 3 "" H 4800 2600 50  0001 C CNN
	1    4800 2600
	1    0    0    -1  
$EndComp
Wire Wire Line
	4800 2600 4800 2700
Wire Wire Line
	5650 4650 5900 4650
Wire Wire Line
	5300 4750 5300 4650
$Comp
L ensaimedia-rescue:+3V3-power #PWR0108
U 1 1 5D0DA9DE
P 5300 4250
F 0 "#PWR0108" H 5300 4100 50  0001 C CNN
F 1 "+3V3" H 5315 4423 50  0000 C CNN
F 2 "" H 5300 4250 50  0001 C CNN
F 3 "" H 5300 4250 50  0001 C CNN
	1    5300 4250
	1    0    0    -1  
$EndComp
Wire Wire Line
	5300 4250 5300 4300
Wire Wire Line
	7200 1450 7200 1550
Wire Wire Line
	7200 1550 6600 1550
$Comp
L ensaimedia-rescue:GND-power #PWR0109
U 1 1 5D0DED5E
P 6600 5650
F 0 "#PWR0109" H 6600 5400 50  0001 C CNN
F 1 "GND" H 6605 5477 50  0000 C CNN
F 2 "" H 6600 5650 50  0001 C CNN
F 3 "" H 6600 5650 50  0001 C CNN
	1    6600 5650
	1    0    0    -1  
$EndComp
Wire Wire Line
	6600 5650 6600 5550
Wire Wire Line
	6200 5550 6400 5550
NoConn ~ 7300 3850
NoConn ~ 7300 4050
NoConn ~ 7300 4150
Wire Wire Line
	7300 4450 7900 4450
Wire Wire Line
	7900 4450 7900 4550
Wire Wire Line
	7300 4550 7900 4550
$Comp
L ensaimedia-rescue:+3V3-power #PWR0110
U 1 1 5D0E31E0
P 7900 4450
F 0 "#PWR0110" H 7900 4300 50  0001 C CNN
F 1 "+3V3" H 7915 4623 50  0000 C CNN
F 2 "" H 7900 4450 50  0001 C CNN
F 3 "" H 7900 4450 50  0001 C CNN
	1    7900 4450
	1    0    0    -1  
$EndComp
Connection ~ 7900 4450
Wire Wire Line
	7300 4750 7900 4750
Wire Wire Line
	7900 4750 7900 4550
Connection ~ 7900 4550
$Comp
L ensaimedia-rescue:GND-power #PWR0111
U 1 1 5D0E4510
P 7900 5400
F 0 "#PWR0111" H 7900 5150 50  0001 C CNN
F 1 "GND" H 7905 5227 50  0000 C CNN
F 2 "" H 7900 5400 50  0001 C CNN
F 3 "" H 7900 5400 50  0001 C CNN
	1    7900 5400
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:C-Device C1
U 1 1 5D0E74D2
P 8100 5850
F 0 "C1" H 8215 5896 50  0000 L CNN
F 1 "0.1u" H 8215 5805 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 8138 5700 50  0001 C CNN
F 3 "~" H 8100 5850 50  0001 C CNN
	1    8100 5850
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:C-Device C2
U 1 1 5D0E7575
P 8500 5850
F 0 "C2" H 8615 5896 50  0000 L CNN
F 1 "0.1u" H 8615 5805 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 8538 5700 50  0001 C CNN
F 3 "~" H 8500 5850 50  0001 C CNN
	1    8500 5850
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:C-Device C3
U 1 1 5D0E75EB
P 8900 5850
F 0 "C3" H 9015 5896 50  0000 L CNN
F 1 "0.1u" H 9015 5805 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 8938 5700 50  0001 C CNN
F 3 "~" H 8900 5850 50  0001 C CNN
	1    8900 5850
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:C-Device C4
U 1 1 5D0E766C
P 9300 5850
F 0 "C4" H 9415 5896 50  0000 L CNN
F 1 "0.1u" H 9415 5805 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 9338 5700 50  0001 C CNN
F 3 "~" H 9300 5850 50  0001 C CNN
	1    9300 5850
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:+3V3-power #PWR0112
U 1 1 5D0E78AA
P 8700 5500
F 0 "#PWR0112" H 8700 5350 50  0001 C CNN
F 1 "+3V3" H 8715 5673 50  0000 C CNN
F 2 "" H 8700 5500 50  0001 C CNN
F 3 "" H 8700 5500 50  0001 C CNN
	1    8700 5500
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:GND-power #PWR0113
U 1 1 5D0E7925
P 8700 6150
F 0 "#PWR0113" H 8700 5900 50  0001 C CNN
F 1 "GND" H 8705 5977 50  0000 C CNN
F 2 "" H 8700 6150 50  0001 C CNN
F 3 "" H 8700 6150 50  0001 C CNN
	1    8700 6150
	1    0    0    -1  
$EndComp
Wire Wire Line
	8100 6000 8500 6000
Wire Wire Line
	8500 6000 8700 6000
Connection ~ 8500 6000
Wire Wire Line
	8900 6000 9300 6000
Connection ~ 8900 6000
Wire Wire Line
	8700 6150 8700 6000
Connection ~ 8700 6000
Wire Wire Line
	8700 6000 8900 6000
Wire Wire Line
	8100 5700 8500 5700
Wire Wire Line
	8500 5700 8700 5700
Connection ~ 8500 5700
Wire Wire Line
	8900 5700 9300 5700
Connection ~ 8900 5700
Wire Wire Line
	8700 5500 8700 5700
Connection ~ 8700 5700
Wire Wire Line
	8700 5700 8900 5700
Wire Wire Line
	7300 5150 7900 5150
Wire Wire Line
	7900 5150 7900 5400
$Comp
L ensaimedia-rescue:GND-power #PWR0114
U 1 1 5D0F3EE3
P 4550 4700
F 0 "#PWR0114" H 4550 4450 50  0001 C CNN
F 1 "GND" H 4550 4400 50  0000 C CNN
F 2 "" H 4550 4700 50  0001 C CNN
F 3 "" H 4550 4700 50  0001 C CNN
	1    4550 4700
	1    0    0    -1  
$EndComp
Wire Wire Line
	4550 4250 4550 4550
$Comp
L ensaimedia-rescue:VBUS-power #PWR0115
U 1 1 5D0F5A8A
P 5000 3650
F 0 "#PWR0115" H 5000 3500 50  0001 C CNN
F 1 "VBUS" H 5015 3823 50  0000 C CNN
F 2 "" H 5000 3650 50  0001 C CNN
F 3 "" H 5000 3650 50  0001 C CNN
	1    5000 3650
	1    0    0    -1  
$EndComp
Wire Wire Line
	4850 3650 5000 3650
$Comp
L ensaimedia-rescue:Conn_01x02_Male-Connector J3
U 1 1 5D0FB10C
P 3550 1450
F 0 "J3" H 3700 1200 50  0000 R CNN
F 1 "POW_SW" H 3800 1550 50  0000 R CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Horizontal" H 3550 1450 50  0001 C CNN
F 3 "~" H 3550 1450 50  0001 C CNN
	1    3550 1450
	1    0    0    1   
$EndComp
$Comp
L ensaimedia-rescue:PWR_FLAG-power #FLG0101
U 1 1 5D101EB2
P 9050 4650
F 0 "#FLG0101" H 9050 4725 50  0001 C CNN
F 1 "PWR_FLAG" H 9050 4824 50  0000 C CNN
F 2 "" H 9050 4650 50  0001 C CNN
F 3 "~" H 9050 4650 50  0001 C CNN
	1    9050 4650
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:PWR_FLAG-power #FLG0102
U 1 1 5D1022B2
P 2300 1450
F 0 "#FLG0102" H 2300 1525 50  0001 C CNN
F 1 "PWR_FLAG" H 2300 1624 50  0000 C CNN
F 2 "" H 2300 1450 50  0001 C CNN
F 3 "~" H 2300 1450 50  0001 C CNN
	1    2300 1450
	1    0    0    -1  
$EndComp
Wire Wire Line
	2300 1450 2650 1450
Wire Wire Line
	9050 4650 9050 4850
Wire Wire Line
	9050 4850 9400 4850
Connection ~ 9400 4850
Wire Wire Line
	9400 4850 9800 4850
Wire Wire Line
	5400 3700 5400 3950
Wire Wire Line
	5700 3600 5700 3850
Text Label 5750 3600 0    50   ~ 0
D+
Text Label 5450 3700 0    50   ~ 0
D-
Wire Wire Line
	5700 3600 5750 3600
Connection ~ 6400 5550
Connection ~ 6600 5550
Connection ~ 6600 1550
Wire Wire Line
	6400 5550 6600 5550
Connection ~ 5700 3850
Wire Wire Line
	5700 3850 5900 3850
Wire Wire Line
	4850 3850 5700 3850
Connection ~ 5400 3950
Wire Wire Line
	5400 3950 4850 3950
Wire Wire Line
	5400 3950 5900 3950
Wire Wire Line
	5400 3700 5450 3700
$Comp
L ensaimedia-rescue:ESP-12E-RF_Module U2
U 1 1 5D139A50
P 2150 3550
F 0 "U2" H 2150 4528 50  0000 C CNN
F 1 "ESP-12E" H 2150 4437 50  0000 C CNN
F 2 "RF_Module:ESP-12E" H 2150 3550 50  0001 C CNN
F 3 "http://wiki.ai-thinker.com/_media/esp8266/esp8266_series_modules_user_manual_v1.1.pdf" H 1800 3650 50  0001 C CNN
	1    2150 3550
	1    0    0    -1  
$EndComp
NoConn ~ 1550 3350
NoConn ~ 1550 3550
NoConn ~ 1550 3650
NoConn ~ 1550 3750
NoConn ~ 1550 3850
NoConn ~ 1550 3950
NoConn ~ 1550 4050
$Comp
L ensaimedia-rescue:GND-power #PWR0116
U 1 1 5D14529E
P 2150 4400
F 0 "#PWR0116" H 2150 4150 50  0001 C CNN
F 1 "GND" H 2155 4227 50  0000 C CNN
F 2 "" H 2150 4400 50  0001 C CNN
F 3 "" H 2150 4400 50  0001 C CNN
	1    2150 4400
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:+3V3-power #PWR0117
U 1 1 5D1452E1
P 1600 2000
F 0 "#PWR0117" H 1600 1850 50  0001 C CNN
F 1 "+3V3" H 1615 2173 50  0000 C CNN
F 2 "" H 1600 2000 50  0001 C CNN
F 3 "" H 1600 2000 50  0001 C CNN
	1    1600 2000
	1    0    0    -1  
$EndComp
NoConn ~ 2750 3950
NoConn ~ 2750 3750
NoConn ~ 2750 3550
NoConn ~ 2750 3450
NoConn ~ 2750 3350
$Comp
L ensaimedia-rescue:R-Device R4
U 1 1 5D14D10F
P 1300 2700
F 0 "R4" H 1370 2746 50  0000 L CNN
F 1 "10K" H 1370 2655 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 1230 2700 50  0001 C CNN
F 3 "~" H 1300 2700 50  0001 C CNN
	1    1300 2700
	1    0    0    -1  
$EndComp
Wire Wire Line
	2150 2750 1800 2750
Wire Wire Line
	1800 2750 1800 2550
Wire Wire Line
	1300 2850 1300 2950
Wire Wire Line
	1300 2950 1550 2950
Wire Wire Line
	1300 2950 1300 3150
Wire Wire Line
	1300 3150 1550 3150
Connection ~ 1300 2950
$Comp
L ensaimedia-rescue:R-Device R5
U 1 1 5D156FEE
P 2900 4000
F 0 "R5" H 2970 4046 50  0000 L CNN
F 1 "10K" H 2970 3955 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 2830 4000 50  0001 C CNN
F 3 "~" H 2900 4000 50  0001 C CNN
	1    2900 4000
	1    0    0    -1  
$EndComp
Wire Wire Line
	2750 3850 2900 3850
Wire Wire Line
	2900 4400 2150 4400
Wire Wire Line
	2900 4150 2900 4400
Wire Wire Line
	2150 4400 2150 4250
Connection ~ 2150 4400
Wire Wire Line
	2750 3150 3250 3150
Wire Wire Line
	3250 3150 3250 4750
Wire Wire Line
	3250 4750 1300 4750
Wire Wire Line
	1300 4750 1300 3150
Connection ~ 1300 3150
$Comp
L ensaimedia-rescue:R-Device R6
U 1 1 5D1623C0
P 3100 2800
F 0 "R6" H 3170 2846 50  0000 L CNN
F 1 "10K" H 3170 2755 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 3030 2800 50  0001 C CNN
F 3 "~" H 3100 2800 50  0001 C CNN
	1    3100 2800
	1    0    0    -1  
$EndComp
Wire Wire Line
	2750 2950 3100 2950
$Comp
L ensaimedia-rescue:Conn_01x02_Male-Connector J4
U 1 1 5D1647FF
P 3750 3050
F 0 "J4" H 3722 2930 50  0000 R CNN
F 1 "BOOT" H 3722 3021 50  0000 R CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 3750 3050 50  0001 C CNN
F 3 "~" H 3750 3050 50  0001 C CNN
	1    3750 3050
	-1   0    0    1   
$EndComp
Wire Wire Line
	2650 1250 2650 1450
Wire Wire Line
	3050 1350 2950 1350
Wire Wire Line
	2950 1350 2950 1250
Wire Wire Line
	3050 1450 2650 1450
Connection ~ 2650 1450
Wire Wire Line
	3050 1350 3750 1350
Connection ~ 3050 1350
Wire Wire Line
	3750 1450 3050 1450
Connection ~ 3050 1450
Wire Wire Line
	3550 2950 3100 2950
Connection ~ 3100 2950
$Comp
L ensaimedia-rescue:GND-power #PWR0119
U 1 1 5D17A8BA
P 3550 3150
F 0 "#PWR0119" H 3550 2900 50  0001 C CNN
F 1 "GND" H 3555 2977 50  0000 C CNN
F 2 "" H 3550 3150 50  0001 C CNN
F 3 "" H 3550 3150 50  0001 C CNN
	1    3550 3150
	1    0    0    -1  
$EndComp
Wire Wire Line
	3550 3150 3550 3050
Wire Wire Line
	10000 4450 9800 4450
Wire Wire Line
	9800 4450 9800 4850
Connection ~ 9800 4850
Wire Wire Line
	9800 4850 10000 4850
Text Label 2750 3050 0    50   ~ 0
P12
Text Label 2750 3250 0    50   ~ 0
P16
Text Label 2750 3650 0    50   ~ 0
P22
Text Label 9100 1050 0    50   ~ 0
P15
Text Label 10000 2450 2    50   ~ 0
P33
Text Label 10000 2350 2    50   ~ 0
P29
Text Label 10000 2250 2    50   ~ 0
P24
Text Label 10000 2150 2    50   ~ 0
P21
Text Label 10000 2050 2    50   ~ 0
P15
Text Label 10000 4250 2    50   ~ 0
P48
Text Label 10000 4150 2    50   ~ 0
P45
Text Label 10000 4050 2    50   ~ 0
P41
Text Label 10000 3950 2    50   ~ 0
P34
Text Label 10000 3850 2    50   ~ 0
P30
Text Label 10000 3750 2    50   ~ 0
P26
Text Label 10000 3650 2    50   ~ 0
P22
Text Label 10000 3550 2    50   ~ 0
P16
Text Label 10000 3450 2    50   ~ 0
P12
Text Label 10000 5850 2    50   ~ 0
P57
Text Label 10000 5750 2    50   ~ 0
P50
Text Label 10000 5650 2    50   ~ 0
P46
Text Label 10000 5550 2    50   ~ 0
P43
Text Label 10000 5450 2    50   ~ 0
P35
Text Label 10000 5350 2    50   ~ 0
P32
Text Label 10000 5250 2    50   ~ 0
P27
Text Label 10000 5150 2    50   ~ 0
P23
Text Label 10000 5050 2    50   ~ 0
P17
Text Label 10000 4950 2    50   ~ 0
P14
Wire Wire Line
	5300 4750 5900 4750
$Comp
L ensaimedia-rescue:R-Device R3
U 1 1 5D19F55C
P 5650 4500
F 0 "R3" H 5720 4546 50  0000 L CNN
F 1 "2K2" H 5720 4455 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 5580 4500 50  0001 C CNN
F 3 "~" H 5650 4500 50  0001 C CNN
	1    5650 4500
	1    0    0    -1  
$EndComp
Wire Wire Line
	5650 4350 5650 4300
Wire Wire Line
	5650 4300 5300 4300
Connection ~ 5300 4300
Wire Wire Line
	5300 4300 5300 4350
$Comp
L ensaimedia-rescue:C-Device C5
U 1 1 5D1A407D
P 4050 4400
F 0 "C5" H 4165 4446 50  0000 L CNN
F 1 "0.1u" H 4165 4355 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 4088 4250 50  0001 C CNN
F 3 "~" H 4050 4400 50  0001 C CNN
	1    4050 4400
	1    0    0    -1  
$EndComp
Wire Wire Line
	4450 4250 4050 4250
Wire Wire Line
	4050 4550 4550 4550
Connection ~ 4550 4550
Wire Wire Line
	4550 4550 4550 4700
Text Label 7300 2450 0    50   ~ 0
P34
Text Label 7300 2550 0    50   ~ 0
P33
Text Label 7300 2650 0    50   ~ 0
P32
Text Label 7300 2750 0    50   ~ 0
P29
Text Label 7300 2850 0    50   ~ 0
P27
Text Label 7300 2950 0    50   ~ 0
P26
Text Label 7300 3050 0    50   ~ 0
P24
Text Label 7300 3150 0    50   ~ 0
P23
Text Label 7300 3250 0    50   ~ 0
P21
Text Label 7300 3550 0    50   ~ 0
P17
Text Label 7300 2150 0    50   ~ 0
P44
Text Label 10000 4350 2    50   ~ 0
P56_ID
Text Label 8300 2300 2    50   ~ 0
P56_ID
$Comp
L ensaimedia-rescue:GND-power #PWR0120
U 1 1 5D1D70D3
P 8800 2750
F 0 "#PWR0120" H 8800 2500 50  0001 C CNN
F 1 "GND" H 8805 2577 50  0000 C CNN
F 2 "" H 8800 2750 50  0001 C CNN
F 3 "" H 8800 2750 50  0001 C CNN
	1    8800 2750
	1    0    0    -1  
$EndComp
Text Label 7300 3750 0    50   ~ 0
P45
Text Label 7300 3450 0    50   ~ 0
P30
Text Label 10000 2650 2    50   ~ 0
P44
Text Label 10000 2750 2    50   ~ 0
P47
Text Label 10000 2550 2    50   ~ 0
P40
$Comp
L ensaimedia-rescue:Conn_01x03_Male-Connector J5
U 1 1 5D14C10C
P 8900 1050
F 0 "J5" H 9006 1328 50  0000 C CNN
F 1 "UART" H 9006 1237 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x03_P2.54mm_Vertical" H 8900 1050 50  0001 C CNN
F 3 "~" H 8900 1050 50  0001 C CNN
	1    8900 1050
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:GND-power #PWR0121
U 1 1 5D14C8CF
P 9100 1350
F 0 "#PWR0121" H 9100 1100 50  0001 C CNN
F 1 "GND" H 9105 1177 50  0000 C CNN
F 2 "" H 9100 1350 50  0001 C CNN
F 3 "" H 9100 1350 50  0001 C CNN
	1    9100 1350
	1    0    0    -1  
$EndComp
Wire Wire Line
	9100 1350 9100 1150
Text Label 10000 2850 2    50   ~ 0
P51
Text Label 10000 2950 2    50   ~ 0
P58
$Comp
L ensaimedia-rescue:C-Device C6
U 1 1 5D160581
P 800 2700
F 0 "C6" H 915 2746 50  0000 L CNN
F 1 "0.1u" H 915 2655 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 838 2550 50  0001 C CNN
F 3 "~" H 800 2700 50  0001 C CNN
	1    800  2700
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:GND-power #PWR0123
U 1 1 5D16083E
P 800 2850
F 0 "#PWR0123" H 800 2600 50  0001 C CNN
F 1 "GND" H 805 2677 50  0000 C CNN
F 2 "" H 800 2850 50  0001 C CNN
F 3 "" H 800 2850 50  0001 C CNN
	1    800  2850
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:R-Device R8
U 1 1 5D3BD943
P 4450 2850
F 0 "R8" H 4520 2896 50  0000 L CNN
F 1 "100K" H 4520 2805 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 4380 2850 50  0001 C CNN
F 3 "~" H 4450 2850 50  0001 C CNN
	1    4450 2850
	1    0    0    -1  
$EndComp
Wire Wire Line
	4800 3150 4800 3000
Wire Wire Line
	4450 3250 4450 3000
$Comp
L ensaimedia-rescue:GND-power #PWR0118
U 1 1 5D3C4B33
P 4150 2700
F 0 "#PWR0118" H 4150 2450 50  0001 C CNN
F 1 "GND" H 4150 2500 50  0000 C CNN
F 2 "" H 4150 2700 50  0001 C CNN
F 3 "" H 4150 2700 50  0001 C CNN
	1    4150 2700
	1    0    0    -1  
$EndComp
Wire Wire Line
	4450 2700 4450 2550
Wire Wire Line
	4450 2550 4150 2550
Wire Wire Line
	4150 2550 4150 2700
$Comp
L ensaimedia-rescue:Conn_01x02_Male-Connector J6
U 1 1 5D3D0922
P 1800 2300
F 0 "J6" H 1772 2180 50  0000 R CNN
F 1 "ESP_SW" H 1772 2271 50  0000 R CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 1800 2300 50  0001 C CNN
F 3 "~" H 1800 2300 50  0001 C CNN
	1    1800 2300
	-1   0    0    1   
$EndComp
Wire Wire Line
	1300 2550 1600 2550
Wire Wire Line
	1600 2200 1600 2000
Wire Wire Line
	1600 2300 1600 2450
Connection ~ 1600 2550
Wire Wire Line
	1600 2550 1800 2550
Wire Wire Line
	3100 2650 3100 2450
Wire Wire Line
	3100 2450 1600 2450
Connection ~ 1600 2450
Wire Wire Line
	1600 2450 1600 2550
Wire Wire Line
	800  2550 800  2450
Wire Wire Line
	800  2450 1600 2450
$Comp
L ensaimedia-rescue:DS2431 U3
U 1 1 5DAFCB84
P 9100 2300
F 0 "U3" H 9428 2346 50  0000 L CNN
F 1 "DS2431" H 9428 2255 50  0000 L CNN
F 2 "Package_TO_SOT_THT:TO-92_Inline" H 9100 2700 50  0001 C CNN
F 3 "" H 9100 2700 50  0001 C CNN
	1    9100 2300
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:R-Device R7
U 1 1 5DB37466
P 8500 2150
F 0 "R7" H 8570 2196 50  0000 L CNN
F 1 "1K" H 8570 2105 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric_Pad1.15x1.40mm_HandSolder" V 8430 2150 50  0001 C CNN
F 3 "~" H 8500 2150 50  0001 C CNN
	1    8500 2150
	1    0    0    -1  
$EndComp
Wire Wire Line
	9000 2300 8500 2300
Wire Wire Line
	8500 2300 8300 2300
Connection ~ 8500 2300
$Comp
L ensaimedia-rescue:+5V-power #PWR0122
U 1 1 5DBA2CC3
P 8500 2000
F 0 "#PWR0122" H 8500 1850 50  0001 C CNN
F 1 "+5V" H 8515 2173 50  0000 C CNN
F 2 "" H 8500 2000 50  0001 C CNN
F 3 "" H 8500 2000 50  0001 C CNN
	1    8500 2000
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:+5V-power #PWR0124
U 1 1 5DBB7E3A
P 10500 5950
F 0 "#PWR0124" H 10500 5800 50  0001 C CNN
F 1 "+5V" H 10515 6123 50  0000 C CNN
F 2 "" H 10500 5950 50  0001 C CNN
F 3 "" H 10500 5950 50  0001 C CNN
	1    10500 5950
	1    0    0    -1  
$EndComp
Wire Wire Line
	10000 5950 10500 5950
Wire Wire Line
	9000 2200 8800 2200
Wire Wire Line
	8800 2200 8800 2750
$Comp
L ensaimedia-rescue:GND-power #PWR0125
U 1 1 5DC4D151
P 8550 1350
F 0 "#PWR0125" H 8550 1100 50  0001 C CNN
F 1 "GND" H 8555 1177 50  0000 C CNN
F 2 "" H 8550 1350 50  0001 C CNN
F 3 "" H 8550 1350 50  0001 C CNN
	1    8550 1350
	1    0    0    -1  
$EndComp
$Comp
L Connector:Conn_01x06_Male J7
U 1 1 5DC572CC
P 7900 1050
F 0 "J7" H 8008 1431 50  0000 C CNN
F 1 "External" H 8008 1340 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x06_P2.54mm_Vertical" H 7900 1050 50  0001 C CNN
F 3 "~" H 7900 1050 50  0001 C CNN
	1    7900 1050
	1    0    0    -1  
$EndComp
Wire Wire Line
	8100 1350 8550 1350
Text Label 8100 950  0    50   ~ 0
P57
Text Label 8100 1050 0    50   ~ 0
P50
Text Label 8100 1150 0    50   ~ 0
P46
Text Label 8100 1250 0    50   ~ 0
P43
Text Label 8100 850  0    50   ~ 0
P56_ID
Text Label 7300 1750 0    50   ~ 0
P58
Text Label 9100 950  0    50   ~ 0
P14
Text Label 7300 1850 0    50   ~ 0
P51
Text Label 7300 1950 0    50   ~ 0
P48
Text Label 7300 2050 0    50   ~ 0
P47
Text Label 7300 2250 0    50   ~ 0
P41
Text Label 7300 2350 0    50   ~ 0
P40
Text Notes 9300 1050 0    50   ~ 0
TX
Text Notes 9300 950  0    50   ~ 0
RX
Wire Wire Line
	7300 5050 7900 5050
Wire Wire Line
	7900 5050 7900 5150
Connection ~ 7900 5150
Text Label 7300 4250 0    50   ~ 0
P35
Text Label 7300 4650 0    50   ~ 0
P30
Wire Wire Line
	7300 4850 7900 4850
Wire Wire Line
	7900 4850 7900 5050
Connection ~ 7900 5050
$Comp
L ensaimedia-rescue:Conn_01x03_Male-Connector J8
U 1 1 5DE1F45B
P 8200 3600
F 0 "J8" H 8306 3878 50  0000 C CNN
F 1 "DIR" H 8306 3787 50  0000 C CNN
F 2 "Jumper:SolderJumper-3_P1.3mm_Open_RoundedPad1.0x1.5mm" H 8200 3600 50  0001 C CNN
F 3 "~" H 8200 3600 50  0001 C CNN
	1    8200 3600
	1    0    0    -1  
$EndComp
Wire Wire Line
	7300 4950 8600 4950
Wire Wire Line
	8600 4950 8600 3600
Wire Wire Line
	8600 3600 8400 3600
$Comp
L ensaimedia-rescue:GND-power #PWR0126
U 1 1 5DE26024
P 8750 3700
F 0 "#PWR0126" H 8750 3450 50  0001 C CNN
F 1 "GND" H 8755 3527 50  0000 C CNN
F 2 "" H 8750 3700 50  0001 C CNN
F 3 "" H 8750 3700 50  0001 C CNN
	1    8750 3700
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:+3V3-power #PWR0127
U 1 1 5DE2D716
P 8550 3350
F 0 "#PWR0127" H 8550 3200 50  0001 C CNN
F 1 "+3V3" H 8565 3523 50  0000 C CNN
F 2 "" H 8550 3350 50  0001 C CNN
F 3 "" H 8550 3350 50  0001 C CNN
	1    8550 3350
	1    0    0    -1  
$EndComp
Wire Wire Line
	8400 3700 8550 3700
Wire Wire Line
	8550 3700 8550 3350
Wire Wire Line
	8750 3500 8750 3700
Wire Wire Line
	8400 3500 8750 3500
$Comp
L Device:Crystal Y1
U 1 1 5DE827EF
P 5150 1100
F 0 "Y1" H 5150 1368 50  0000 C CNN
F 1 "Crystal" H 5150 1277 50  0000 C CNN
F 2 "Crystal:Crystal_HC49-U_Vertical" H 5150 1100 50  0001 C CNN
F 3 "~" H 5150 1100 50  0001 C CNN
	1    5150 1100
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:C-Device C7
U 1 1 5DE83D0C
P 4650 1250
F 0 "C7" H 4765 1296 50  0000 L CNN
F 1 "12pF" H 4765 1205 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 4688 1100 50  0001 C CNN
F 3 "~" H 4650 1250 50  0001 C CNN
	1    4650 1250
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:C-Device C8
U 1 1 5DED0E8E
P 5600 1250
F 0 "C8" H 5715 1296 50  0000 L CNN
F 1 "12pF" H 5715 1205 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric_Pad1.15x1.40mm_HandSolder" H 5638 1100 50  0001 C CNN
F 3 "~" H 5600 1250 50  0001 C CNN
	1    5600 1250
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:GND-power #PWR0128
U 1 1 5DED1E86
P 4650 1400
F 0 "#PWR0128" H 4650 1150 50  0001 C CNN
F 1 "GND" H 4650 1200 50  0000 C CNN
F 2 "" H 4650 1400 50  0001 C CNN
F 3 "" H 4650 1400 50  0001 C CNN
	1    4650 1400
	1    0    0    -1  
$EndComp
$Comp
L ensaimedia-rescue:GND-power #PWR0129
U 1 1 5DED24CE
P 5600 1400
F 0 "#PWR0129" H 5600 1150 50  0001 C CNN
F 1 "GND" H 5600 1200 50  0000 C CNN
F 2 "" H 5600 1400 50  0001 C CNN
F 3 "" H 5600 1400 50  0001 C CNN
	1    5600 1400
	1    0    0    -1  
$EndComp
Wire Wire Line
	4450 3250 5900 3250
Wire Wire Line
	4800 3150 5900 3150
Wire Wire Line
	5900 2550 5000 2550
Wire Wire Line
	5000 2550 5000 1100
Wire Wire Line
	5300 1100 5300 2050
Wire Wire Line
	5300 2050 5900 2050
Wire Wire Line
	5300 1100 5600 1100
Connection ~ 5300 1100
Wire Wire Line
	5000 1100 4650 1100
Connection ~ 5000 1100
Text Notes 8700 3450 0    50   ~ 0
DIRection:\n3V3 = FPGA --> USB\nGND = USB --> FPGA
$EndSCHEMATC
