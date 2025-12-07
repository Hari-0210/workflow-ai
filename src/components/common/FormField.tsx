import { Controller, type Control, type RegisterOptions } from 'react-hook-form';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Autocomplete,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    FormLabel,
} from '@mui/material';

interface FormFieldOption {
    label: string;
    value: any;
}

interface FormFieldProps {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'autocomplete' | 'radio' | 'checkbox' | 'textarea';
    control: Control<any>;
    options?: FormFieldOption[];
    rules?: RegisterOptions;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
}

export default function FormField({
    name,
    label,
    type,
    control,
    options = [],
    rules,
    placeholder,
    rows = 4,
    disabled = false,
}: FormFieldProps) {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => {
                switch (type) {
                    case 'text':
                    case 'number':
                        return (
                            <TextField
                                {...field}
                                label={label}
                                type={type}
                                error={!!error}
                                helperText={error?.message}
                                placeholder={placeholder}
                                fullWidth
                                variant="outlined"
                                size="small"
                                disabled={disabled}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(102, 126, 234, 0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#fff',
                                    },
                                }}
                            />
                        );

                    case 'textarea':
                        return (
                            <TextField
                                {...field}
                                label={label}
                                error={!!error}
                                helperText={error?.message}
                                placeholder={placeholder}
                                fullWidth
                                multiline
                                rows={rows}
                                variant="outlined"
                                size="small"
                                disabled={disabled}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(102, 126, 234, 0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#fff',
                                    },
                                }}
                            />
                        );

                    case 'select':
                        return (
                            <FormControl fullWidth error={!!error} size="small">
                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{label}</InputLabel>
                                <Select
                                    {...field}
                                    label={label}
                                    disabled={disabled}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        color: '#fff',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(102, 126, 234, 0.5)',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#667eea',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: '#1a1a24',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                '& .MuiMenuItem-root': {
                                                    color: '#fff',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: 'rgba(102, 126, 234, 0.3)',
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                >
                                    {options.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {error && <FormHelperText>{error.message}</FormHelperText>}
                            </FormControl>
                        );

                    case 'autocomplete':
                        return (
                            <Autocomplete
                                {...field}
                                options={options}
                                getOptionLabel={(option: any) => option.label || option}
                                onChange={(_, data) => field.onChange(data?.value || data)}
                                disabled={disabled}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={label}
                                        error={!!error}
                                        helperText={error?.message}
                                        placeholder={placeholder}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                '& fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(102, 126, 234, 0.5)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#667eea',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                            },
                                            '& .MuiInputBase-input': {
                                                color: '#fff',
                                            },
                                        }}
                                    />
                                )}
                                sx={{
                                    '& .MuiAutocomplete-popupIndicator': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                    },
                                }}
                                ListboxProps={{
                                    sx: {
                                        backgroundColor: '#1a1a24',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        '& .MuiAutocomplete-option': {
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'rgba(102, 126, 234, 0.3)',
                                            },
                                        },
                                    },
                                }}
                            />
                        );

                    case 'radio':
                        return (
                            <FormControl error={!!error} disabled={disabled}>
                                <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>{label}</FormLabel>
                                <RadioGroup {...field} row>
                                    {options.map((option) => (
                                        <FormControlLabel
                                            key={option.value}
                                            value={option.value}
                                            control={
                                                <Radio
                                                    sx={{
                                                        color: 'rgba(255, 255, 255, 0.5)',
                                                        '&.Mui-checked': {
                                                            color: '#667eea',
                                                        },
                                                    }}
                                                />
                                            }
                                            label={option.label}
                                            sx={{ color: '#fff' }}
                                        />
                                    ))}
                                </RadioGroup>
                                {error && <FormHelperText>{error.message}</FormHelperText>}
                            </FormControl>
                        );

                    case 'checkbox':
                        return (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={field.value || false}
                                        disabled={disabled}
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.5)',
                                            '&.Mui-checked': {
                                                color: '#667eea',
                                            },
                                        }}
                                    />
                                }
                                label={label}
                                sx={{ color: '#fff' }}
                            />
                        );

                    default:
                        return <></>;
                }
            }}
        />
    );
}
