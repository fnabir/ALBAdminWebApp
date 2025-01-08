"use client"

import Layout from "@/components/layout"
import React, {useState} from "react";
import {ScrollArea} from "@/components/ui/scrollArea";
import CustomInput from "@/components/generic/CustomInput";
import {Button} from "@/components/ui/button";
import CardErrorCode from "@/components/card/cardErrorCode";
import {MdError} from "react-icons/md";
import CardIcon from "@/components/card/cardIcon";

export default function CallbackPage() {
	const breadcrumb: {text: string, link?: string}[] = [
		{ text: "Home", link: "/" },
		{ text: "/" },
		{ text: "Error Code" },
	]

	const [ errorCode, setErrorCode] = useState("");
	const [ errorTitle, setErrorTitle] = useState("");
	const [ level, setLevel] = useState("");
	const [ description, setDescription] = useState("");
	const [ cause, setCause] = useState("");
	const [ solution, setSolution] = useState("");

	const level1a = "1A\nThe elevator running is not affected on any condition.";
	//const level2a = "2A\nThe parallel/group control function is disabled.";
	const level2b = "2B\nThe door pre-open/re-leveling function is disabled.";
	const level3a = "3A\nIn low-speed running, the elevator stops at special deceleration rate, and cannot restart.";
	const level3b = "3B\nIn low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.";
	const level4a = "4A\nIn low-speed running, the elevator stops under special deceleration rate, and cannot restart.";
	const level4b = "4B\nIn low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.";
	const level4c = "4C\nIn low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.";
	const level5a = "5A\nIn low-speed running, the elevator stops immediately and cannot restart.";
	//const level5b = "5B\nIn low-speed running, the elevator does not stop. In normal-speed running, the elevator stops, and then can start running at low speed after a delay of 3s.";

	const description1 = "Invert unit protection";
	const description2 = "Overcurrent during acceleration";
	const description3 = "Overcurrent during deceleration";
	const description4 = "Overcurrent at constant speed";
	const description5 = "Overvoltage during acceleration";
	const description6 = "Overvoltage during deceleration";
	const description7 = "Overvoltage at constant speed";
	const description8 = "Maintenance notification period reached";
	const description9 = "Undervoltage";
	const description10 = "Controller overload";
	const description11 = "Motor overload";
	const description12 = "Power supply phase loss";
	const description13 = "Power output phase loss";
	const description14 = "Module overheat";
	const description15 = "Output abnormal";
	const description16 = "Current control fault";
	const description17 = "Encoder interference during motor auto-tuning";
	const description18 = "Current detection fault";
	const description19 = "Motor auto-tuning fault";
	const description20 = "Speed feedback incorrect";
	const description22 = "Leveling signal abnormal";
	const description23 = "Motor short circuit to ground";
	const description24 = "RTC clock fault";
	const description25 = "Storage data abnormal";
	const description26 = "Earthquake signal";
	const description29 = "Shorting PMSM stator contactor feedback abnormal";
	const description30 = "Elevator position abnormal";
	const description33 = "Elevator speed abnormal";
	const description34 = "Logic fault";
	const description35 = "Shaft auto- tuning data abnormal";
	const description36 = "RUN contactor feedback abnormal";
	const description37 = "Brake contactor feedback abnormal";
	const description38 = "Encoder signal abnormal";
	const description39 = "Motor overheat";
	const description41 = "Safety circuit disconnected";
	const description42 = "Door lock disconnected during running";
	const description43 = "Up limit signal abnormal";
	const description44 = "Down limit signal abnormal";
	const description45 = "Slow-down switch abnormal";
	const description46 = "Re-leveling abnormal";
	const description47 = "Shorting door lock circuit contactor abnormal";
	const description48 = "Door open fault";
	const description49 = "Door close fault";
	const description50 = "Consecutive loss of leveling signal";
	const description51 = "CAN communication abnormal";
	const description52 = "HCB communication abnormal";
	const description53 = "Door lock fault";
	const description54 = "Overcurrent at inspection startup";
	const description55 = "Stop at another landing floor";
	const description57 = "Serial peripheral interface (SPI) communication abnormal";
	const description58 = "Shaft position switches abnormal";
	const description62 = "Analog input cable broken";

	const cause1 = "●	Main loop output is grounding or short wiring\n●	The connection of traction machine is too long\n●	Work condition is too hot\n●	The connections inside the controller become loose"
	const cause2 = "●	The main circuit output is grounded or short circuited.\n●	Motor auto-tuning is performed improperly.\n●	The encoder signal is incorrect.";
	const cause3 = "●	The main circuit output is grounded or short circuited.\n●	Motor auto-tuning is performed improperly.\n●	The deceleration rate is too short.\n●	The encoder signal is incorrect.";
	const cause4 = "●	The main circuit output is grounded or short circuited.\n●	Motor auto-tuning is performed properly.\n●	The encoder is seriously interfered with.";
	const cause5 = "●	The input voltage is too high.\n●	The regeneration power of the motor is too high.\n●	The braking resistance is too large, or the braking unit fails.\n●	The acceleration rate is too short.";
	const cause6 = "●	The input voltage is too high.\n●	The braking resistance is too large, or the braking unit fails.\n●	The deceleration rate is too short.";
	const cause7 = "●	The input voltage is too high.\n●	The braking resistance is too large, or the braking unit fails.";
	const cause8 = "●	The elevator is not maintained within the notification period.";
	const cause9 = "●	Instantaneous power failure occurs on the input power supply.\n●	The input voltage is too low.\n●	The drive control board fails.";
	const cause10 = "●	This fault is reported generally when the controller runs at the current higher than the rated value for a long time. The causes include:\n●	The mechanical resistance is too large.\n●	The balance coefficient is improper.\n●	The encoder feedback signal is abnormal.\n●	Motor auto-tuning is not performed properly (the elevator running current is higher than the normal in this case).";
	const cause11 = "●	FC-02 is set improperly.\n●	The mechanical resistance is too large.\n●	The balance coefficient is improper.";
	const cause12 = "●	The power input phases are not symmetric.\n●	The drive control board fails.";
	const cause13 = "●	The output wiring of the main circuit is loose.\n●	The motor is damaged.";
	const cause14 = "●	The ambient temperature is too high.\n●	The fan is damaged.\n●	The air filter is clogged.";
	const cause15 = "●	Braking (resistor) short occurs on the output side.\n●	The RUN contactor is abnormal.";
	const cause16 = "●	Subcodes 1, 2: The current deviation is too large.\n●	Subcode 3: The speed deviation is too large.";
	const cause17 = "●	Subcode 1: Reserved.\n\n●	Subcode 2: The SIN/ COS encoder signal is abnormal.\n●	Subcode 3: The UVW encoder signal is abnormal.";
	const cause18 = "●	The drive control board fails.";
	const cause19 = "●	Subcode 1: Learning the stator resistance fails.\n●	Subcodes 5, 6: Learning the magnetic pole position fails.\n●	Subcode 8: Reserved.\n●	Subcode 11: Saving the angle fails at synchronous motor angle-free auto- tuning.\n●	Subcodes 101, 102: Motor auto-tuning fails.";
	const cause20 = "●	Subcode 1:The encoder signal is not detected during synchronous motor no-load auto-tuning.\n●	Subcode 2: Reserved.\n●	Subcode 3: The phase sequence of the motor is incorrect.\n●	Subcode 4: Z signal cannot be detected during synchronous motor auto- tuning.\n●	Subcode 5: The cables of the SIN/COS encoder break.\n●	Subcode 7: The cables of the UVW encoder break.\n●	Subcode 8: Reserved\n●	Subcode 9: The speed deviation is too large.\n●	Subcode 10, 11: Reserved.\n●	Subcode 12: The encoder AB signals are lost at startup.\n●	Subcode 13: The encoder AB signals are lost during running.\n●	Subcodes 14–18: Reserved.\n●	Subcode 19: The signals of the SIN/COS encoder are seriously interfered with during running.\n●	Subcode 55: The signals of the SIN/COS encoder are seriously interfered with or CD signals are incorrect during motor auto-tuning.";
	const cause22 = "●	Subcode 101: The leveling signal is stuck.\n●	Subcode 102: The leveling signal is lost.\n●	Subcode 103: The leveling position deviation is too large in elevator auto- running state.";
	const cause23 = "●	Short circuit to ground exists on the motor side.";
	const cause24 = "●	Subcode 101: The RTC clock information of the MCB is abnormal.";
	const cause25 = "●	Subcodes 101, 102: The storage data of the MCB is abnormal.";
	const cause26 = "●	Subcode 101: The earthquake signal is active and the duration exceeds 2s.";
	const cause29 = "●	Subcode 101: Feedback of the shorting PMSM stator contactor is abnormal.";
	const cause30 = "●	Subcodes 101, 102: In the normal&#8211;speed running or re&#8211;leveling running mode, the running time is larger than the smaller of F9&#8211;02 and (FA- 38 + 10), but the leveling signal has no change.";
	const cause33 = "●	Subcode 101: The detected running speed during normal-speed running exceeds the limit.\n●	Subcode 102: The speed exceeds the limit during inspection or shaft auto- tuning.\n●	Subcode 103: The speed exceeds the limit in shorting stator braking mode.\n●	Subcode 104: The speed exceeds the limit during emergency running.\n●	Subcode 105: The emergency running time protection function is enabled (set in Bit8 of F6&#8211;45), and the running time exceeds 50s, causing the timeout fault.";
	const cause34 = "●	Logic of the MCB is abnormal.";
	const cause35 = "●	Subcode 101: When shaft auto-tuning is started, the elevator is not at the bottom floor or the down slow-down switch is invalid,\n●	Subcode 102: The system is not in the inspection state (inspection switch not turned on) when shaft auto-tuning is performed.\n●	Subcode 103: It is judged upon power-on that shaft auto-tuning is not performed.\n●	Subcodes 104, 113, 114: In distance control mode, it is judged at running startup that shaft auto- tuning is not performed.\n●	Subcode 105: The elevator running direction and the pulse change are inconsistent.\n●	Subcodes 106, 107, 109: The plate pulse length sensed at up/down leveling is abnormal.\n●	Subcodes 108, 110: No leveling signal is received within 45s continuous running.\n●	Subcodes 111, 115: The stored floor height is smaller than 50 cm.\n●	Subcode 112: The floor when auto-tuning is completed is not the top floor.";
	const cause36 = "●	Subcode 101: The feedback of the RUN contactor is active, but the contactor has no output.\n●	Subcode 102: The controller outputs the RUN signal but receives no RUN feedback.\n●	Subcode 103: The startup current of the asynchronous motor is too small.\n●	Subcode 104: When both feedback signals of the RUN contactor are enabled, their states are inconsistent.";
	const cause37 = "●	Subcode 101: The output of the brake contactor is inconsistent with the feedback.\n●	Subcode 102: When both feedback signals of the brake contactor are enabled, their states are inconsistent.\n●	Subcode 103: The output of the brake contactor is inconsistent with the brake travel switch 1 feedback.\n●	Subcode 104: When both feedback signals of brake travel switch 1 are enabled, their states are inconsistent.\n●	Subcode 105: The brake contactor feedback is valid before the brake contactor opens.\n●	Subcode 106: The output of the brake contactor is inconsistent with the brake travel switch 2 feedback.\n●	Subcode 107: When both feedback signal of brake travel switch 2 are enabled, their states are inconsistent.";
	const cause38 = "●	Subcode 101: The pulses in F4&#8211;03 does not change within the time threshold in of F1&#8211;13.\n●	Subcode 102: F4&#8211;03 increases in down direction.\n●	Subcode 103: F4&#8211;03 decreases in up direction.\n●	Subcode 104:The SVC is used in distance control mode.";
	const cause39 = "●	Subcode 101: The motor overheat relay input remains valid for a certain time.";
	const cause41 = "●	Subcode 101: The safety circuit signal becomes OFF.";
	const cause42 = "●	Subcodes 101, 102: The door lock circuit feedback is invalid during the elevator running.";
	const cause43 = "●	Subcode 101: The up limit switch acts when the elevator is running in the up direction.";
	const cause44 = "●	Subcode 101: The down limit switch acts when the elevator is running in the down direction.";
	const cause45 = "●	Subcode 101: The down slow-down distance is insufficient during shaft auto-tuning.\n●	Subcode 102: The up slow-down distance is insufficient during shaft auto-tuning.\n●	Subcode 103: The slow- down switch is stuck or abnormal during normal running.";
	const cause46 = "●	Subcode 101: The leveling signal is inactive during re-leveling.\n●	Subcode 102: The re- leveling running speed exceeds 0.1 m/s.\n●	Subcode 103: At startup of normal-speed running, the re-leveling state is valid and there is shorting door lock circuit feedback.\n●	Subcode 104: During re-leveling, no shorting door lock circuit feedback or door lock signal is received 2s after shorting door lock circuit output.";
	const cause47 = "●	Subcode 101: During re-leveling or pre-open running, the shorting door lock circuit contactor outputs for  continuous 2s, but the feedback is invalid and the door lock is disconnected.\n●	Subcode 102: During re-leveling or pre-open running, the shorting door lock circuit contactor has no output, but the feedback is valid for continuous 2s.\n●	Subcode 103: During re-leveling or pre-open running, the output time of the shorting door lock circuit contactor is larger than 15s.";
	const cause48 = "●	Subcode 101: The consecutive times that the door does not open to the limit reaches the setting in Fb-09.";
	const cause49 = "●	Subcode 101: The consecutive times that the door does not open to the limit reaches the setting in Fb-09.";
	const cause50 = "●	Subcode 101: Leveling signal stuck is detected for three consecutive times.\n●	Subcode 102: Leveling signal loss is detected for three consecutive times."
	const cause51 = "●	Subcode 101: Feedback data of CANbus communication with the CTB remains incorrect.";
	const cause52 = "●	Subcode 101: Feedback data of Modbus communication with the HCB remains incorrect.";
	const cause53 = "●	Subcode 101: The door lock feedback signal remains active 3s after door open output.\n    ●	Subcode 102: The states of the door lock multi-way feedback contacts are inconsistent 3s after door open output.\n    ●	Subcode 103: Reserved.\n    ●	Subcode 104: The higher- voltage and low-voltage door lock signals are inconsistent.";
	const cause54 = "●	Subcode 101: reserved\n●	Subcode 102: The current at startup for inspection exceeds 120% of the rated current.";
	const cause55 = "●	Subcode 101: During automatic running of the elevator, the door open limit  is not received within the time threshold in Fb-06.";
	const cause57 = "●	Subcodes 101, 102: The SPI communication is abnormal. No correct data is received with 2s of DSP communication.\n●	Subcode 103: The MCB does not match the AC drive.";
	const cause58 = "●	Subcode 101: The up slow-down switch and down slow-down\nswitch are disconnected simultaneously.\n●	Subcode 102:  The up limit feedback and down limit feedback are disconnected simultaneously.";
	const cause62 = "●	Subcode 101: The current car load  (F8&#8211;05) is smaller than the car no&#8211;load (F8&#8211;06) and the deviation is larger than the threshold.";

	const solution1 = "●	Obviate exterior problems such as connection\n●	Add reactor or output filter\n●	Inspect the wind channel and fan\n●	Please contact with agent or factory";
	const solution234 = "1. Check the contactors:\n●	Check whether the RUN contactor at the controller output side is normal.\n●	Check whether the shorting PMSM stator contactor causes short circuit at the controller output side.\n\n2. Check motor cables:\n●	Check whether the motor cables have damaged jacket, possibly short circuited to ground, and connected securely.\n●	Check insulation of motor power terminals, and check whether the motor winding is short circuited or grounded.\n\n3.	Check motor parameters:\n●	Check whether motor parameters comply with the nameplate.\n\n4.	Check the encoder:\n●	Check whether encoder pulses per revolution (PPR) is set correctly.\n●	Check whether the  encoder  signal is interfered with, whether the encoder cable runs through the duct independently, whether the cable is too long, and whether the shield is grounded at one end.\n●	Check whether the encoder is installed reliably, whether the rotating shaft is connected to the motor shaft reliably by observing whether the encoder is stable during normal-speed running.\n●	Check whether the encoder wirings are correct. For asynchronous motor, perform SVC and compare the current to judge whether the encoder works properly.";
	const solution567 = "1.	Check whether the input voltage is too high. Observe whether the bus voltage is  too high (normal: 540–580 V for 380 voltage input).\n\n2.	Check for the balance coefficient.\n\n3.	Check whether the bus voltage rises too quickly during running. If yes, the regen. resistor does not work or its model is improper:\n●	Check whether the cable connecting the regen. resistor is damaged, whether the cooper wire touches the ground, and whether the connection is reliable.\n●	Check whether the resistance is proper based on the recommendation in chapter 4 and select a proper regen. resistor.\n●	If a braking unit is used, check whether the braking unit works properly and whether the model is proper.\n\n4.	If the resistance of the regen. resistor is proper and overvoltage occurs each time when the elevator reaches the target speed, decrease the values of F2&#8211;01 or F2&#8211;04 to reduce the curve following error and prevent overvoltage due to system overshoot.\n\n5.	Check whether the acceleration/deceleration rate is too short when E05 and E06 is reported.";
	const solution8 = "●	Power-off and maintain the elevator.\n●	Disable the maintenance notification function by setting F9&#8211;13 to 0.\n●	Contact us or directly our agent.";
	const solution9 = "●	Check whether the external power voltage is too low.\n●	Check whether the power fails during running.\n●	Check whether wiring of all power input cables is secure.\n●	Contact us or directly our agent.";
	const solution10 = "Eliminate mechanical problems:\n●	Check whether the brake is released, and whether the brake power supply is normal.\n●	Check whether the balance coefficient is proper.\n●	Check whether the guide shoes are too tight.\n2. Check the motor auto-tuning result:\n●	Check whether the encoder feedback signal and parameter setting are correct, and whether the initial angle of the encoder for the PMSM is correct.\n●	Check the motor parameter setting and perform motor auto-tuning again.\n3. If this fault is reported when the slip experiment is carried on, perform the slip experiment by using the function set in F3&#8211;24.";
	const solution11 = "●	Restore FC-02 to the default value.\n●	Refer to the solution of E10.";
	const solution12 = "●	Check whether the three phases of  power supply are balanced and whether the power voltage is normal. If not, adjust the power supply.\n●	Contact supplier.";
	const solution13 = "●	Check whether the motor wiring is secure.\n●	Check whether the RUN contactor on the output side is normal.\n●	Eliminate the motor fault.";
	const solution14 = "●	Lower the ambient temperature.\n●	Clear the air filter.\n●	Replace the damaged fan.\n●	Check whether the installation clearance of the controller satisfies the requirement.";
	const solution15 = "●	Check wiring of the regen. resistor and braking unit is correct, without short circuit.\n●	Check whether the main contactor works properly and whether there is arch or stuck problem.\n●	Contact us or directly our agent.";
	const solution16 = "Subcodes 1, 2:\n●	Check whether the input voltage is low (often in temporary power supply).\n●	Check whether cable connection between the controller and the motor is secure.\n●	Check whether the RUN contactor works\nproperly.\n\nSubcode 3:\n●	Check the circuit of the encoder:\n->	Check whether encoder pulses per revolution (PPR) is set correctly.\n->	Check whether the encoder signal is interfered with, whether the encoder cable runs through the duct independently, whether the cable is too long, and whether the shield is grounded at one end.\n->Check whether the encoder is installed reliably, whether the rotating shaft is connected to the motor shaft reliably by observing whether the encoder is stable during normal-speed running.\n●	Check whether the motor parameters are correct, and perform motor auto-tuning again.\n●	Increase the torque upper limit in F2&#8211;08.";
	const solution17 = "Subcode 2:\n●	Serious interference exists in the C, D, and Z signals of the SIN/COS encoder. Check whether the encoder c cable is laid separately from the power cables, and whether system grounding is reliable.\n●	Check whether the PG card is wired correctly.\nSubcode 3:\n●	Serious interference exists in  the  U, V, and W signals of the UVW encoder. Check whether the encoder c cable is laid separately from the power cables, and whether system grounding is reliable.\n●	Check whether the PG card is wired correctly.";
	const solution18 = "●	Contact Supplier.";
	const solution19 = "Subcodes 1, 5, 6:\n●	Check the motor wiring and whether phase loss occurs on the contactor at the output side.\n\nSubcode 11:\n●	At angle-free motor auto-tuning, the power is cut off when the motor rotary displacement is too small, and this fault is reported at direct running upon power-on again. To rectify the fault, perform angle-free motor auto- tuning again and make the motor runs for consecutive three revolutions.\n\nSubcode 101:\n●	Synchronous motor with-load auto-tuning times out.\n●	Check encoder wiring is correct, or replace the PG card and perform motor auto-tuning again.\n\nSubcode 102:\n●	Motor auto-tuning times out in operation panel control mode.\n●	Check encoder wiring is correct, or replace the PG card and perform motor auto-tuning again.";
	const solution20 = "Subcode 1, 4, 5, 7:\n●	Check whether the encoder signal circuit is normal.\n●	Check whether the PG card is normal.\n\nSubcode 3:\n●	Exchange any two phases of the motor UVW cables.\n\nSubcode 9:\n●	The angle of the synchronous motor is abnormal. Perform motor auto-tuning again.\n●	The speed loop proportional gain is small or integral time is large. Increase the proportional gain or decrease the integral time properly.\n\nSubcode 12:\n●	Check whether the brake has been released.\n●	Check whether AB signal cables of the encoder break.\n●	If the motor cannot be started at the slip experiment, perform the slip experiment by using the function set in F3&#8211;24.\n\nSubcode 13:\n●	AB signals of the encoder become loss suddenly. Check whether encoder wiring is correct, whether strong interference exists, or the motor is stuck due to sudden power failure of the brake during running.\n\nSubcode 19:\n●	The encoder analog signals are seriously interfered with during motor running, or encoder signals are in poor contact. You need to check the encoder circuit.\n\nSubcode 55:\nThe encoder analog signals are seriously interfered with during motor auto-tuning, or encoder CD signals are in wrong sequence.";
	const solution22 = "Subcodes 101, 102:\n●	Check whether the leveling and door zone sensors work properly.\n●	Check the installation verticality and depth of the leveling plates.\n●	Check the leveling signal input points of the MCB.\n\nSubcode 103:\nCheck whether the steel rope slips.";
	const solution23 = "●	Check whether short circuit to ground exists on the motor side.";
	const solution24 = "Subcode 101:\n●	Replace the clock battery.\n●	Replace the MCB.";
	const solution25 = "Subcodes 101, 102: Contact supplier.";
	const solution26 = "Subcode 101:\n●	Check that the earthquake signal is consistent with the parameter setting (NC, NO) of the MCB.";
	const solution29 = "Subcode 101:\n●	Check that the signal feature (NO, NC) of the feedback contact on the contactor is correct.\n●	Check that the contactor and corresponding feedback contact act correctly.\n●	Check the coil circuit of the shorting PMSM stator contactor.";
	const solution30 = "Subcodes 101, 102:\n●	Check whether the leveling signal cables are connected reliably and whether the signal copper wires may touch the ground or be short circuited with other signal cables.\n●	Check whether the distance between two floors is too large or the re-leveling time set in F3&#8211;21 is too short, causing over long re&#8211;leveling running time.\n●	Check whether signal loss exists in the encoder circuits.";
	const solution33 = "Subcode 101:\n●	Check whether the parameter setting and wiring of the encoder are correct.\n●	Check the setting of motor nameplate parameters. Perform motor auto-tuning again.\n\nSubcode 102:\n●	Attempt to decrease the inspection speed or perform motor auto-tuning again.\n\nSubcode 103:\n●	Check whether the shorting PMSM stator function is enabled.\n\nSubcodes 104, 105:\n●	Check whether the emergency power capacity meets the requirements.\n●	Check whether the emergency running speed is set properly.";
	const solution34 = "●	Contact supplier to replace the MCB.";
	const solution35 = "1.	Handling at inspection-speed commissioning:\nE35 (subcode 103) is reported at each power-on because shaft  auto-tuning  is not performed before inspection-speed commissioning. This fault does not affect inspection&#8211;speed commissioning and you can hide the fault directly on the operation panel.\n\n2.	Handling at normal&#8211;speed commissioning and running:\n\nSubcode 101:\n●	Check that the down slow&#8211;down switch is valid, and that F4&#8211;01 (Current floor) is set to the bottom floor number.\n\nSubcode 102:\n●	Check that the inspection switch is turned to inspection state.\n\nSubcodes 103, 104, 113, 114:\n●	Perform shat auto-tuning again.\n\nSubcode 105:\n●	Check whether the elevator running direction is consistent with the pulse change  in  F4&#8211;03: F4&#8211;03 increases in up direction and decreases in down direction. If not, change the value of F2&#8211;10 to ensure consistency.\n\nSubcode 106, 107, 109:\n●	Check that NO/NC state of the leveling sensor is set correctly.\n●	Check whether the leveling plates are inserted properly and whether there is strong power interference if the leveling sensor signal blinks.\n●	Check whether the leveling plate is too long for the asynchronous motor.\n\nSubcodes 108, 110:\n●	Check whether wiring of the leveling sensor is correct.\n●	Check whether the floor distance is too large, causing running time&#8211;out. Increase the speed set in F3&#8211;11 and perform shaft auto&#8211;tuning again to ensure that learning the floors can be completed within 45s.\n\nSubcodes 111, 115:\n●	Enable the super short floor function if the floor distance is less than 50 cm. If the floor distance is normal, check installation of the leveling plate for this floor and check the sensor.\n\nSubcode 112:\n●	Check whether the setting of F6&#8211;00 (Top floor of the elevator) is smaller than the actual condition.";
	const solution36 = "Subcodes 101, 102, 104:\n●	Check whether the feedback contact of the contactor acts properly.\n●	Check the signal feature (NO, NC) of the feedback contact.\n\nSubcode 103:\n●	Check whether the output cables UVW of the controller are connected properly.\n●	Check whether the control circuit of the RUN contactor coil is normal.";
	const solution37 = "Subcode 101:\n●	Check whether the brake contactor opens and closes properly.\n●	Check the signal feature (NO, NC) of the feedback contact on the brake contactor is set correctly.\n●	Check whether the feedback circuit of the brake contactor is normal.\n\nSubcode 102:\n●	Check whether the signal feature (NO, NC) of the multi&#8211;way contacts is set correctly.\n●	Check whether the states of the multi&#8211;way feedback contacts are consistent.\n\nSubcode 103, 105:\n●	Check whether the signal feature (NO, NC) of the brake travel switch &#189; feedback is set correctly.\n●	Check whether the circuit of the brake travel switch &#189; feedback is normal.\n\nSubcode 104, 107:\n●	Check whether the signal feature (NO, NC) of the brake travel switch &#189; feedback is set correctly.\n●	Check whether the states of the multi&#8211;way feedback contacts are consistent.\n\nSubcode 105:\nCheck whether the feedback contact of the brake contactor mal&#8211;functions.";
	const solution38 = "Subcode 101:\n●	Check whether the encoder is used correctly.\n●	Check whether the brake works properly.\n\nSubcodes 102, 103:\n●	Check whether parameter setting and wiring of the encoder are correct.\n\nSubcode 104:\n●	Set F0&#8211;00 (Control mode) to 1 (Closed-loop vector control) in distance control mode.";
	const solution39 = "Subcode 101:\n●	Check whether the parameter setting (NO, NC) is correct.\n●	Check whether the thermal protection relay socket is normal.\n●	Check whether the motor is used properly and whether it is damaged.\n●	Improve cooling conditions of the motor.";
	const solution41 = "Subcode 101:\n●	Check the safety circuit switches and their states.\n●	Check whether the external power supply is normal.\n●	Check whether the safety circuit contactor acts properly.\n●	Confirm the signal feature (NO, NC) of the feedback contact of the safety circuit contactor.";
	const solution42 = "Subcodes 101, 102:\n●	Check whether the hall door lock and the car door lock are in good contact.\n●	Check whether the door lock contactor acts properly.\n●	Check the signal feature (NO, NC) of the feedback contact on the door lock contactor.\n●	Check whether the external power supply is normal.";
	const solution43 = "Subcode 101:\n●	Check the signal feature (NO, NC) of the up limit switch.\n●	Check whether the up limit switch is in good contact.\n●	Check whether the limit switch is installed at a relatively low position and acts even when the elevator arrives at the terminal floor normally.";
	const solution44 = "Subcode 101:\n●	Check the signal feature (NO, NC) of the down limit switch.\n●	Check whether the down limit switch is in good contact.\n●	Check whether the limit switch is installed at a relatively high position and thus acts even when the elevator arrives at the terminal floor normally.";
	const solution45 = "Subcodes 101 to 103:\n●	Check whether the up slow-down switch and the down slow-down switch are in good contact.\n●	Check the signal feature (NO, NC) of the up slow-down switch and the down slow- down switch.\n●	Ensure that the obtained slow-down distance satisfies the slow-down requirement at the elevator speed.";
	const solution46 = "Subcode 101:\n●	Check whether the leveling signal is normal.\n\nSubcode 102:\n●	Check whether the encoder is used properly.\n\nSubcodes 103, 104:\n●	Check whether the signal of the leveling sensor is normal.\n●	Check the signal feature (NO, NC) of the feedback contact on the shorting door lock circuit contactor, and check the relay and wiring of the SCB-A board.";
	const solution47 = "Subcodes 101, 102:\n●	Check the signal feature (NO, NC) of the feedback contact on the shorting door lock circuit contactor.\n●	Check whether the shorting door lock circuit contactor acts properly.\n\nSubcode 103:\n●	Check whether the leveling and re-leveling signals are normal.\n●	Check whether the re-leveling speed is set too low.";
	const solution48 = "Subcode 101:\n●	Check whether the door machine system works properly.\n●	Check whether the CTB output is normal.\n●	Check whether the door open limit signal and door lock signal are normal.";
	const solution49 = "Subcode 101:\n●	Check whether the door machine system works properly.\n●	Check whether the CTB output is normal.\n●	Check whether the door close limit signal and door lock signal are normal.";
	const solution50 = "Subcodes 101, 102:\n●	Check whether the leveling and door zone sensors work properly.\n●	Check the installation verticality and deth of the leveling plates.\n●	Check the leveling signal input points of the MCB.\n●	Check whether the steel rope slips.";
	const solution51 = "1.	Handling at inspection-speed commissioning:\n●	This fault does not affect inspection-speed commissioning and you can hide the fault directly on the operation panel.\n\n2.	Handling at normal-speed commissioning and running:\n\nSubcode 101:\n●	Check the communication cable connection.\n●	Check the power supply of the CTB.\n●	Check whether the 24 V power supply of the controller is normal.\n●	Check whether there is strong-power interference on communication.";
	const solution52 = "1.	Handling at inspection-speed commissioning:\nThis fault does not affect inspection-speed commissioning and you can hide the fault directly on the operation panel.\n\n2.	Handling at normal-speed commissioning and running:\n\nSubcode 101:\n●	Check the communication cable connection.\n●	Check whether the 24 V power supply of the controller is normal.\n●	Check whether the HCB addresses are repeated.\n●	Check whether there is strong-power interference on communication.";
	const solution53 = "Subcode 101:\n●	Check whether the door lock circuit is normal.\n●	Check whether the feedback contact of the door lock contactor acts properly.\n●	Check whether the system receives the door open limit signal when the door lock signal is valid.\n\nSubcode 102:\nCheck whether when the hall door lock signal and the car door lock signal are detected separately, the detected states of the hall door locks and car door lock are inconsistent.\n\nSubcode 104:\n●	When the higher-voltage and low-voltage door lock signals are detected at the same time, the time when the MCB receives the two signals has a deviation of above 1.5s. This causes system protection.\n●	This subcode is reset at power-off and power-on again.";
	const solution54 = "Subcode 102:\n●	Reduce the load\n●	Change Bit1 of FC-00 to 1 to cancel the startup current detection function.";
	const solution55 = "Subcode 101:\n●	Check the door open limit signal at the present floor.";
	const solution57 = "Subcodes 101, 102:\n●	Check the wiring between the control board and the drive board.\n\nSubcode 103:\n●	Contact Supplier.";
	const solution58 = "Subcodes 101, 102:\n●	Check whether the signal feature (NO, NC) of the slow-down switches and limit switches are consistent with the parameter setting of the MCB.\n●	Check whether malfunction of the slow-down switches and limit switches exists.";
	const solution62 = "Subcode 101:\n●	Check whether F5&#8211;36 is set correctly.\n●	Check whether the analog input cable of the CTB or MCB is connected correctly or broken.\n●	Adjust the load cell switch function.";

	const handleSearch = async () => {
		if (errorCode.length == 1) setErrorTitle("E0" + errorCode)
		else setErrorTitle("E" + errorCode)

		switch(errorCode) {
			case "1":
				setErrorTitle("E01")
				setDescription(description1);
				setLevel(level5a)
				setCause(cause1);
				setSolution(solution1);
				break;
			case "2":
				setDescription(description2);
				setLevel(level5a)
				setCause(cause2);
				setSolution(solution234);
				break;
			case "3":
				setDescription(description3);
				setLevel(level5a)
				setCause(cause3);
				setSolution(solution234);
				break;
			case "4":
				setDescription(description4);
				setLevel(level5a)
				setCause(cause4);
				setSolution(solution234);
				break;
			case "5":
				setDescription(description5);
				setLevel(level5a)
				setCause(cause5);
				setSolution(solution567);
				break;
			case "6":
				setDescription(description6);
				setLevel(level5a)
				setCause(cause6);
				setSolution(solution567);
				break;
			case "7":
				setDescription(description7);
				setLevel(level5a)
				setCause(cause7);
				setSolution(solution567);
				break;
			case "8":
				setDescription(description8);
				setLevel(level5a)
				setCause(cause8);
				setSolution(solution8);
				break;
			case "9":
				setDescription(description9);
				setLevel(level5a)
				setCause(cause9);
				setSolution(solution9);
				break;
			case "10":
				setDescription(description10);
				setLevel(level4a)
				setCause(cause10);
				setSolution(solution10);
				break;
			case "11":
				setDescription(description11);
				setLevel(level3a)
				setCause(cause11);
				setSolution(solution11);
				break;
			case "12":
				setDescription(description12);
				setLevel(level4a)
				setCause(cause12);
				setSolution(solution12);
				break;
			case "13":
				setDescription(description13);
				setLevel(level4a)
				setCause(cause13);
				setSolution(solution13);
				break;
			case "14":
				setDescription(description14);
				setLevel(level5a)
				setCause(cause14);
				setSolution(solution14);
				break;
			case "15":
				setDescription(description15);
				setLevel(level5a)
				setCause(cause15);
				setSolution(solution15);
				break;
			case "16":
				setDescription(description16);
				setLevel(level5a)
				setCause(cause16);
				setSolution(solution16);
				break;
			case "17":
				setDescription(description17);
				setLevel(level5a)
				setCause(cause17);
				setSolution(solution17);
				break;
			case "18":
				setDescription(description18);
				setLevel(level5a)
				setCause(cause18);
				setSolution(solution18);
				break;
			case "19":
				setDescription(description19);
				setLevel(level5a)
				setCause(cause19);
				setSolution(solution19);
				break;
			case "20":
				setDescription(description20);
				setLevel(level5a)
				setCause(cause20);
				setSolution(solution20);
				break;
			case "22":
				setDescription(description22);
				setLevel(level1a)
				setCause(cause22);
				setSolution(solution22);
				break;
			case "23":
				setDescription(description23);
				setLevel(level5a)
				setCause(cause23);
				setSolution(solution23);
				break;
			case "24":
				setDescription(description24);
				setLevel(level3b)
				setCause(cause24);
				setSolution(solution24);
				break;
			case "25":
				setDescription(description25);
				setLevel(level4a)
				setCause(cause25);
				setSolution(solution25);
				break;
			case "26":
				setDescription(description26);
				setLevel(level3b)
				setCause(cause26);
				setSolution(solution26);
				break;
			case "29":
				setDescription(description29);
				setLevel(level5a)
				setCause(cause29);
				setSolution(solution29);
				break;
			case "30":
				setDescription(description30);
				setLevel(level4a)
				setCause(cause30);
				setSolution(solution30);
				break;
			case "33":
				setDescription(description33);
				setLevel(level5a)
				setCause(cause33);
				setSolution(solution33);
				break;
			case "34":
				setDescription(description34);
				setLevel(level5a)
				setCause(cause34);
				setSolution(solution34);
				break;
			case "35":
				setDescription(description35);
				setLevel(level4c)
				setCause(cause35);
				setSolution(solution35);
				break;
			case "36":
				setDescription(description36);
				setLevel(level5a)
				setCause(cause36);
				setSolution(solution36);
				break;
			case "37":
				setDescription(description37);
				setLevel(level5a)
				setCause(cause37);
				setSolution(solution37);
				break;
			case "38":
				setDescription(description38);
				setLevel(level5a)
				setCause(cause38);
				setSolution(solution38);
				break;
			case "39":
				setDescription(description39);
				setLevel(level3a)
				setCause(cause39);
				setSolution(solution39);
				break;
			case "41":
				setDescription(description41);
				setLevel(level5a)
				setCause(cause41);
				setSolution(solution41);
				break;
			case "42":
				setDescription(description42);
				setLevel(level5a)
				setCause(cause42);
				setSolution(solution42);
				break;
			case "43":
				setDescription(description43);
				setLevel(level4c)
				setCause(cause43);
				setSolution(solution43);
				break;
			case "44":
				setDescription(description44);
				setLevel(level4c)
				setCause(cause44);
				setSolution(solution44);
				break;
			case "45":
				setDescription(description45);
				setLevel(level4b)
				setCause(cause45);
				setSolution(solution45);
				break;
			case "46":
				setDescription(description46);
				setLevel(level5a)
				setCause(cause46);
				setSolution(solution46);
				break;
			case "47":
				setDescription(description47);
				setLevel(level2b)
				setCause(cause47);
				setSolution(solution47);
				break;
			case "48":
				setDescription(description48);
				setLevel(level5a)
				setCause(cause48);
				setSolution(solution48);
				break;
			case "49":
				setDescription(description49);
				setLevel(level5a)
				setCause(cause49);
				setSolution(solution49);
				break;
			case "50":
				setDescription(description50);
				setLevel(level5a)
				setCause(cause50);
				setSolution(solution50);
				break;
			case "51":
				setDescription(description51);
				setLevel(level1a)
				setCause(cause51);
				setSolution(solution51);
				break;
			case "52":
				setDescription(description52);
				setLevel(level1a)
				setCause(cause52);
				setSolution(solution52);
				break;
			case "53":
				setDescription(description53);
				setLevel(level5a)
				setCause(cause53);
				setSolution(solution53);
				break;
			case "54":
				setDescription(description54);
				setLevel(level5a)
				setCause(cause54);
				setSolution(solution54);
				break;
			case "55":
				setDescription(description55);
				setLevel(level1a)
				setCause(cause55);
				setSolution(solution55);
				break;
			case "57":
				setDescription(description57);
				setLevel(level5a)
				setCause(cause57);
				setSolution(solution57);
				break;
			case "58":
				setDescription(description58);
				setLevel(level4b)
				setCause(cause58);
				setSolution(solution58);
				break;
			case "62":
				setDescription(description62);
				setLevel(level1a)
				setCause(cause62);
				setSolution(solution62);
				break;
			default:
				setDescription("No Error Code Found!");
				break;
		}
	};

	return (
		<Layout breadcrumb={breadcrumb}>
			<div className={"flex flex-col h-full"}>
				<div className="flex items-center pb-2 gap-x-2">
					<span className="mt-4">NICE 3000</span>
					<CustomInput id="errorCode"
											 type="text"
											 label="Error Code"
											 pre={"E"}
											 onChange={(e) => setErrorCode(e.target.value)}
					/>
					<Button type="submit" className="mt-4" variant="accent" onClick={handleSearch}>Search</Button>
				</div>
				<ScrollArea className={"flex-grow mb-4 -mr-4 pr-4"}>
					{ description &&
						(
							description == "No Error Code Found!" ?
								<CardErrorCode
									title={errorTitle + "\n" + "Details"}
									details={description}
									detailsCenter={true}/>
								: <div className={"flex flex-col py-2 gap-y-2 " + (description == "" ? "hidden" : "")}>
								<CardErrorCode
									title={errorTitle + "\n" + "Details"}
									details={description}
									detailsCenter={true}/>
								<div className="flex gap-x-2">
									<div className="flex flex-col gap-y-2 w-full">
										<CardErrorCode
											title="Fault Level"
											details={level}
											detailsCenter={true}/>
										<CardErrorCode
											title="Cause"
											details={cause}/>
									</div>
									<div className="w-full">
										<CardErrorCode
											title="Solution"
											details={solution}/>
									</div>
								</div>
							</div>
						)
					}
				</ScrollArea>
			</div>
		</Layout>
	)
}