import { SetStateAction, useState } from "react";
import { InputFieldsMap, Result, createRandomNumber } from "../../App";
import { SelectItemOptionsType } from "primereact/selectitem";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { styled, alpha, Box } from '@mui/system';
import { Slider as BaseSlider, sliderClasses } from '@mui/base/Slider';
import { Card } from 'primereact/card';

import './Settings.css';
import '../../Laratheme.css'
// import { Tooltip } from "primereact/tooltip";


interface SettingsProps {
    setAssignmentType: React.Dispatch<SetStateAction<Result>>;
    assignmentType: Result;
    TLBWays: number;
    setTLBWays: React.Dispatch<SetStateAction<number>>;
    TLBSets: number;
    setTLBSets: React.Dispatch<SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<SetStateAction<16 | 32 | 64>>;
    virtualAddressBitWidth: number;
    setVirtualAddressBitWidth: React.Dispatch<SetStateAction<number>>;
    physicalAddressBitWidth: number;
    setPhysicalAddressBitWidth: React.Dispatch<SetStateAction<number>>;
}

interface Mark {
    value: number;
    label: string
};



const TLBSetMarks: Mark[] = [
    {
        value: 0,
        label: '4',
    },
    {
        value: 25,
        label: '8',
    },
    {
        value: 50,
        label: '16',
    },
    {
        value: 75,
        label: '32',
    },
    {
        value: 100,
        label: '64',
    },
];


const TLBWaysMarks: Mark[] = [
    {
        value: 0,
        label: '1',
    },
    {
        value: 25,
        label: '2',
    },
    {
        value: 50,
        label: '3',
    },
    {
        value: 75,
        label: '4',
    },
    {
        value: 100,
        label: '5',
    },
];

const virtualBitLengthMark: Mark[] = [
    {
        value: 0,
        label: '12',
    },
    {
        value: 25,
        label: '16',
    },
    {
        value: 50,
        label: '24',
    },
    {
        value: 75,
        label: '28',
    },
    {
        value: 100,
        label: '32',
    },
];

export default function Settings({
    setAssignmentType,
    setPageSize,
    setPhysicalAddressBitWidth,
    setTLBSets,
    setTLBWays,
    setVirtualAddressBitWidth,
    assignmentType,
    TLBSets,
    TLBWays,
    virtualAddressBitWidth,
    physicalAddressBitWidth,
    pageSize
}: SettingsProps) {
    setPageSize
    setPhysicalAddressBitWidth
    TLBWays
    virtualAddressBitWidth
    physicalAddressBitWidth
    pageSize
    const [showSettings, setShowSettings] = useState<boolean>(false);

    const assignmentTypeOptions: SelectItemOptionsType = [
        {
            name: InputFieldsMap.TLBHIT,
            code: InputFieldsMap.TLBHIT
        },
        {
            name: InputFieldsMap.PageFault,
            code: InputFieldsMap.PageFault
        },
        {
            name: InputFieldsMap.PageHit,
            code: InputFieldsMap.PageHit
        }
    ]

    function handleTLBSetState(value: number | number[]): void {

        const index = TLBSetMarks.findIndex(mark => value === mark.value);
        setTLBSets(Number(TLBSetMarks[index].label))
    }

    function handleTLBWaysState(value: number | number[]): void {
        const index = TLBWaysMarks.findIndex(mark => value === mark.value);
        setTLBWays(Number(TLBWaysMarks[index].label))
    }


    // function handlePageSizeState(value: number | number[]): void {
    //     setPageSize(value as 16 | 32 | 64)
    // }

    function handleVirtualAddressBitWidthState(value: number | number[]): void {
        const index = virtualBitLengthMark.findIndex(mark => value === mark.value)
        const chosenNumber = Number(virtualBitLengthMark[index].label)
        setVirtualAddressBitWidth(createRandomNumber(chosenNumber - 4, chosenNumber))
    }

    // function handlePhysicalAddressBitWidthState(value: number | number[]): void {
    //     setPhysicalAddressBitWidth(value as number)
    // }



    const footer = (
        <>
            <Button onClick={() => setShowSettings(false)} label="Cancel" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} />
        </>
    );

    return (
        <>

            <i
                className="pi pi-cog"
                style={{ fontSize: '2em', cursor: 'pointer' }}
                onClick={() => setShowSettings(!showSettings)}
            />


            {showSettings && (

                <Card title="Settings" footer={footer} className="md:w-25rem settingItem">
                    <div>
                        <label htmlFor="assignmentType" className="p-d-block">Select an Assignment Type: </label>
                        <Dropdown
                            id="assignmentType"
                            value={{ name: assignmentType, code: assignmentType }}
                            onChange={(e) => setAssignmentType(e.value.name)}
                            optionLabel="name"
                            options={assignmentTypeOptions}
                            placeholder="Select Assignment Type"
                            className="w-full md:w-14rem"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className="settingItem">
                        {/* Slider for the TLB sets */}
                        <label>Select the TLB Sets: </label>
                        <DiscreteSliderValues
                            handleSliderChange={handleTLBSetState}
                            marks={TLBSetMarks}
                            value={TLBSets}
                        />
                    </div>

                    {/* Slider for the TLB Ways */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className="settingItem">
                        <label>Select the TLB Ways: </label>
                        <DiscreteSliderValues
                            handleSliderChange={handleTLBWaysState}
                            marks={TLBWaysMarks}
                            value={TLBWays}
                        />
                    </div>

                    {/* Slider for the TLB Ways */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className="settingItem">
                        <label>Select maximum bit length of Virtual Address: </label>
                        <DiscreteSliderValues
                            handleSliderChange={handleVirtualAddressBitWidthState}
                            marks={virtualBitLengthMark}
                            value={virtualAddressBitWidth}
                        />
                    </div>


                </Card>

            )}

        </>
    );
}


interface DiscreteSliderValuesProps {
    handleSliderChange: (value: number | number[]) => void;
    value: number;
    marks: Mark[];
}


function DiscreteSliderValues(props: DiscreteSliderValuesProps) {
    const defaultValue = props.marks.find((mark) => mark.label === props.value.toString())?.value
    return (
        <Box sx={{ width: 1 / 2 }}>

            <Slider
                defaultValue={defaultValue}
                getAriaValueText={valuetext}
                step={null}
                style={{ width: '28rem' }}
                onChange={(_e, value): any => props.handleSliderChange(value)}
                marks={props.marks}
            />
        </Box>
    );
}



function valuetext(value: number) {
    return `${value}°C`;
}

const blue = {
    100: '#DAECFF',
    200: '#99CCF3',
    400: '#3399FF',
    300: '#66B2FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B3',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Slider = styled(BaseSlider)(
    ({ theme }) => `
  color: ${theme.palette.mode === 'light' ? blue[500] : blue[400]};
  height: 6px;
  width: 100%;
  padding: 16px 0;
  display: inline-block;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  &.${sliderClasses.disabled} { 
    pointer-events: none;
    cursor: default;
    color: ${theme.palette.mode === 'light' ? grey[300] : grey[600]};
    opacity: 0.5;
  }

  & .${sliderClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
    opacity: 0.4;
  }

  & .${sliderClasses.track} {
    display: block;
    position: absolute;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
  }

  & .${sliderClasses.thumb} {
    position: absolute;
    width: 16px;
    height: 16px;
    margin-left: -6px;
    margin-top: -6px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    border: 3px solid currentColor;
    background-color: #fff;

    &:hover{
      box-shadow: 0 0 0 4px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[300],
        0.3,
    )};
    }
    
    &.${sliderClasses.focusVisible} {
      box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
      outline: none;
    }

    &.${sliderClasses.active} {
      box-shadow: 0 0 0 5px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[300],
        0.5,
    )};
      outline: none;
    }
  }

  & .${sliderClasses.mark} {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 99%;
    background-color: ${theme.palette.mode === 'light' ? blue[200] : blue[900]};
    top: 43%;
    transform: translateX(-50%);
  }

  & .${sliderClasses.markActive} {
    background-color: ${theme.palette.mode === 'light' ? blue[500] : blue[400]};
  }

  & .${sliderClasses.markLabel} {
    font-family: IBM Plex Sans;
    font-weight: 600;
    font-size: 12px;
    position: absolute;
    top: 20px;
    transform: translateX(-50%);
    margin-top: 8px;
  }
`,
);