"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useGetProfile } from "@/api/queries/auth";
import { useUpdateProfile } from "@/api/mutations/auth";
import { toast } from "sonner";
import { Calendar, ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { IUpdateProfile } from "@/api/requests/auth";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSettingsSchema } from "@/schema/auth";
import { Skeleton } from "@/components/ui/skeleton";

type FormValues = z.infer<typeof profileSettingsSchema>;

const countries = [
  { name: "Nigeria", code: "NG", flag: "🇳🇬", dialCode: "+234" },
  { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44" },
  { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1" },
];

interface CountryData {
  name: string;
  states: {
    [stateName: string]: string[];
  };
}

const countryData: Record<string, CountryData> = {
  Nigeria: {
    name: "Nigeria",
    states: {
      Lagos: ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Yaba"],
      FCT: ["Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa"],
      Oyo: ["Ibadan", "Ogbomosho", "Oyo City", "Iseyin"],
      Rivers: ["Port Harcourt", "Obio-Akpor", "Bonny"],
    },
  },
  "United States": {
    name: "United States",
    states: {
      California: ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
      "New York": ["New York City", "Buffalo", "Rochester", "Yonkers"],
      Texas: ["Houston", "Austin", "Dallas", "San Antonio"],
      Florida: ["Miami", "Orlando", "Tampa", "Jacksonville"],
    },
  },
  "United Kingdom": {
    name: "United Kingdom",
    states: {
      England: ["London", "Manchester", "Birmingham", "Liverpool"],
      Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
      Wales: ["Cardiff", "Swansea", "Newport"],
    },
  },
  Canada: {
    name: "Canada",
    states: {
      Ontario: ["Toronto", "Ottawa", "Mississauga", "Hamilton"],
      Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau"],
      "British Columbia": ["Vancouver", "Victoria", "Burnaby", "Richmond"],
    },
  },
};

const parsePhoneNumber = (fullNumber: string) => {
  if (!fullNumber) return { dialCode: "+234", localNumber: "" };
  for (const c of countries) {
    if (fullNumber.startsWith(c.dialCode)) {
      return {
        dialCode: c.dialCode,
        localNumber: fullNumber.slice(c.dialCode.length),
      };
    }
  }
  return { dialCode: "+234", localNumber: fullNumber };
};

const ProfileSettings = () => {
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch,
  } = useGetProfile();
  const userProfile = profile?.data;
  console.log({ userProfile });
  const updateProfileMutation = useUpdateProfile();

  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(
    countries[0],
  );
  const [dateInputType, setDateInputType] = useState<"text" | "date">("text");

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      date_of_birth: "",
      country: "",
      state: "",
      city: "",
      address: "",
    },
  });

  const watchedCountry = watch("country");
  const watchedState = watch("state");

  const stateOptions =
    watchedCountry && countryData[watchedCountry]
      ? Object.keys(countryData[watchedCountry].states)
      : [];

  const cityOptions =
    watchedCountry &&
    watchedState &&
    countryData[watchedCountry]?.states[watchedState]
      ? countryData[watchedCountry].states[watchedState]
      : [];

  useEffect(() => {
    if (userProfile) {
      let localPhone = "";
      if (userProfile.phone_number) {
        const parsed = parsePhoneNumber(userProfile.phone_number);
        const matchedCountry = countries.find(
          (c) => c.dialCode === parsed.dialCode,
        );
        if (matchedCountry) {
          setSelectedPhoneCountry(matchedCountry);
        }
        localPhone = parsed.localNumber;
      }

      const savedDob = localStorage.getItem(`dob_${userProfile.user_id}`) || "";
      if (savedDob) {
        setDateInputType("date");
      }

      reset({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        phone_number: localPhone,
        date_of_birth: savedDob,
        country: userProfile.country_name || "",
        state: userProfile.state || "",
        city: userProfile.city || "",
        address: userProfile.street || "",
      });
    }
  }, [userProfile, reset]);

  const handleCountryChange = (countryName: string) => {
    setValue("country", countryName, { shouldValidate: true });
    setValue("state", "", { shouldValidate: true });
    setValue("city", "", { shouldValidate: true });

    const matchedCountry = countries.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase(),
    );
    if (matchedCountry) {
      setSelectedPhoneCountry(matchedCountry);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!userProfile) return;

    const dialCode = selectedPhoneCountry.dialCode;
    let localPhone = data.phone_number.trim();
    if (localPhone.startsWith(dialCode)) {
      localPhone = localPhone.slice(dialCode.length);
    }
    const finalPhoneNumber = localPhone.startsWith("+")
      ? localPhone
      : dialCode + localPhone;

    const payload: IUpdateProfile = {
      first_name: data.first_name,
      last_name: data.last_name,
      country: data.country,
      state: data.state,
      city: data.city,
      street: data.address,
      phone_number: finalPhoneNumber,
      currency: userProfile.active_currency || "NGN",
      address_type: userProfile.address_type || "home",
      house_number: userProfile.house_number || "",
      postal_code: userProfile.postal_code || "",
      allow_promo_email: userProfile.allow_promo_email ?? true,
    };

    try {
      if (data.date_of_birth) {
        localStorage.setItem(`dob_${userProfile.user_id}`, data.date_of_birth);
      }

      await updateProfileMutation.mutateAsync({
        ...payload,
        ...({ date_of_birth: data.date_of_birth } as any),
      });

      toast.success("Profile updated successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="border flex-3 divide-y border-black/60 divide-black/30 font-syne">
        <div className="p-5 bg-[#F1F1F1] space-y-2">
          <Skeleton className="h-6 w-48 bg-black/15" />
          <Skeleton className="h-4 w-96 bg-black/10" />
        </div>
        <div className="p-6 space-y-6 bg-white animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-24 bg-black/10" />
              <Skeleton className="h-12 w-full bg-black/10 rounded-none" />
            </div>
          ))}
        </div>
        <div className="p-5 flex justify-between items-center bg-white">
          <Skeleton className="h-4 w-24 bg-black/10" />
          <Skeleton className="h-12 w-36 bg-black/10 rounded-none" />
        </div>
      </div>
    );
  }

  return (
    <div className="border flex-3 divide-y border-black/60 divide-black/30 font-syne">
      <div className="p-5 bg-[#F1F1F1]">
        <h1 className="text-xl font-semibold">Profile Settings</h1>
        <p className="text-sm text-black/70">
          Update your account information to keep your profile accurate and
          secure.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="divide-y divide-black/30"
      >
        <div className="p-6 space-y-6 bg-white">
          <Controller
            name="first_name"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-black">
                  First name
                </label>
                <input
                  {...field}
                  type="text"
                  placeholder="First name"
                  className={`w-full p-4 border text-sm rounded-none bg-white focus:outline-none focus:border-black ${
                    fieldState.error ? "border-red-500" : "border-black/30"
                  }`}
                />
                {fieldState.error && (
                  <span className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="last_name"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-black">
                  Last name
                </label>
                <input
                  {...field}
                  type="text"
                  placeholder="Last name"
                  className={`w-full p-4 border text-sm rounded-none bg-white focus:outline-none focus:border-black ${
                    fieldState.error ? "border-red-500" : "border-black/30"
                  }`}
                />
                {fieldState.error && (
                  <span className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-black">
                  Phone number
                </label>
                <div
                  className={`flex border rounded-none bg-white focus-within:border-black ${
                    fieldState.error ? "border-red-500" : "border-black/30"
                  }`}
                >
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setIsPhoneDropdownOpen(!isPhoneDropdownOpen)
                      }
                      className="flex items-center gap-1.5 h-full px-4 border-r border-black/35 hover:bg-gray-50 text-sm cursor-pointer select-none"
                    >
                      <span className="text-base leading-none">
                        {selectedPhoneCountry.flag}
                      </span>
                      <ChevronDown size={14} className="text-black/60" />
                    </button>

                    {isPhoneDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsPhoneDropdownOpen(false)}
                        />
                        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-black/30 shadow-lg z-20 max-h-60 overflow-y-auto">
                          {countries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setSelectedPhoneCountry(c);
                                setIsPhoneDropdownOpen(false);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left text-sm cursor-pointer"
                            >
                              <span className="text-base">{c.flag}</span>
                              <span className="font-semibold">
                                {c.dialCode}
                              </span>
                              <span className="text-gray-400 text-xs">
                                ({c.name})
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <input
                    {...field}
                    type="tel"
                    placeholder="Phone number"
                    className="w-full p-4 text-sm rounded-none outline-none bg-white"
                  />
                </div>
                {fieldState.error && (
                  <span className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="date_of_birth"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-black">
                  Date of birth
                </label>
                <div className="relative">
                  <input
                    {...field}
                    type={dateInputType}
                    placeholder="day/month/year"
                    className={`w-full p-4 border text-sm rounded-none bg-white focus:outline-none focus:border-black pr-12 ${
                      fieldState.error ? "border-red-500" : "border-black/30"
                    } [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                    onFocus={() => setDateInputType("date")}
                    onBlur={(e) => {
                      if (!e.target.value) setDateInputType("text");
                      field.onBlur();
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Calendar size={18} className="text-black/60" />
                  </div>
                </div>
                {fieldState.error && (
                  <span className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="country"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-black">
                  Country/region
                </label>
                <div className="relative">
                  <select
                    {...field}
                    className={`w-full p-4 border text-sm appearance-none bg-white focus:outline-none focus:border-black rounded-none pr-12 cursor-pointer ${
                      fieldState.error ? "border-red-500" : "border-black/30"
                    }`}
                    onChange={(e) => {
                      field.onChange(e);
                      handleCountryChange(e.target.value);
                    }}
                  >
                    <option value="">Select country</option>
                    {Object.keys(countryData).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-black/60" />
                  </div>
                </div>
                {fieldState.error && (
                  <span className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="state"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-black">
                  State
                </label>
                <div className="relative">
                  <select
                    {...field}
                    className={`w-full p-4 border text-sm appearance-none bg-white focus:outline-none focus:border-black rounded-none pr-12 cursor-pointer ${
                      fieldState.error ? "border-red-500" : "border-black/30"
                    }`}
                    disabled={!watchedCountry}
                  >
                    <option value="">State</option>
                    {stateOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-black/60" />
                  </div>
                </div>
                {fieldState.error && (
                  <span className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="city"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-black">
                  City
                </label>
                <div className="relative">
                  <select
                    {...field}
                    className={`w-full p-4 border text-sm appearance-none bg-white focus:outline-none focus:border-black rounded-none pr-12 cursor-pointer ${
                      fieldState.error ? "border-red-500" : "border-black/30"
                    }`}
                    disabled={!watchedState}
                  >
                    <option value="">City</option>
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-black/60" />
                  </div>
                </div>
                {fieldState.error && (
                  <span className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-black">
                  Address
                </label>
                <input
                  {...field}
                  type="text"
                  placeholder="Address"
                  className={`w-full p-4 border text-sm rounded-none bg-white focus:outline-none focus:border-black ${
                    fieldState.error ? "border-red-500" : "border-black/30"
                  }`}
                />
                {fieldState.error && (
                  <span className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />
        </div>

        <div className="p-5 flex justify-between items-center bg-white">
          <span className="text-xs text-black/50">*required fields</span>
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="bg-black text-white hover:bg-black/90 px-8 py-4 font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-none"
          >
            {updateProfileMutation.isPending && (
              <Spinner className="text-white" />
            )}
            Update details
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
