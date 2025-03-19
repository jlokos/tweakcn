import React, { useEffect } from "react";
import { ThemeEditorControlsProps } from "@/types/theme";
import ControlSection from "./ControlSection";
import ColorPicker from "./ColorPicker";
import ResetButton from "./ResetButton";
import { useLocation } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import ThemePresetSelect from "./ThemePresetSelect";
import { presets } from "../../utils/themePresets";
import {
  fonts,
  getAppliedThemeFont,
  monoFonts,
  sansSerifFontNames,
  sansSerifFonts,
  serifFonts,
} from "../../utils/theme-fonts";
import { useEditorStore } from "../../store/editorStore";
import { Label } from "../ui/label";
import { SliderWithInput } from "./slider-with-input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import ThemeFontSelect from "./theme-font-select";
import {
  DEFAULT_FONT_MONO,
  DEFAULT_FONT_SANS,
  DEFAULT_FONT_SERIF,
} from "../../config/theme";
import { Separator } from "../ui/separator";
import { AlertCircle } from "lucide-react";

const ThemeControlPanel = ({
  styles,
  currentMode,
  onChange,
  onReset,
  hasChanges = false,
}: ThemeEditorControlsProps) => {
  const location = useLocation();
  const { applyThemePreset, themeState } = useEditorStore();

  useEffect(() => {
    // Handle hash navigation
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Add a small delay to ensure the sections are expanded
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash]);

  const currentStyles = styles?.[currentMode];

  const updateStyle = React.useCallback(
    <K extends keyof typeof currentStyles>(
      key: K,
      value: (typeof currentStyles)[K],
    ) => {
      // apply common styles to both light and dark modes
      if (
        key === "font-sans" ||
        key === "font-serif" ||
        key === "font-mono" ||
        key === "radius"
      ) {
        onChange({
          ...styles,
          light: { ...styles.light, [key]: value },
          dark: { ...styles.dark, [key]: value },
        });
        return;
      }

      onChange({
        ...styles,
        [currentMode]: {
          ...currentStyles,
          [key]: value,
        },
      });
    },
    [onChange, styles, currentMode, currentStyles],
  );

  // Ensure we have valid styles for the current mode
  if (!currentStyles) {
    return null; // Or some fallback UI
  }

  const radius = parseFloat(currentStyles.radius.replace("rem", ""));

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Theme Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && <ResetButton onReset={onReset} label="Reset theme" />}
        </div>
      </div>

      <div className="mb-6 ml-1">
        <Label htmlFor="theme-preset" className="text-xs mb-1.5 block">
          Preset
        </Label>
        <ThemePresetSelect
          presets={presets}
          currentPreset={themeState.preset}
          onPresetChange={applyThemePreset}
        />
      </div>

      <Tabs defaultValue="colors" className="w-full h-full">
        <TabsList className="grid grid-cols-3 mb-3 w-full">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-full pb-4">
          <TabsContent value="colors">
            <ControlSection title="Primary Colors" id="primary-colors" expanded>
              <ColorPicker
                color={currentStyles.primary}
                onChange={(color) => updateStyle("primary", color)}
                label="Primary"
              />
              <ColorPicker
                color={currentStyles["primary-foreground"]}
                onChange={(color) => updateStyle("primary-foreground", color)}
                label="Primary Foreground"
              />
            </ControlSection>

            <ControlSection title="Secondary Colors" expanded>
              <ColorPicker
                color={currentStyles.secondary}
                onChange={(color) => updateStyle("secondary", color)}
                label="Secondary"
              />
              <ColorPicker
                color={currentStyles["secondary-foreground"]}
                onChange={(color) => updateStyle("secondary-foreground", color)}
                label="Secondary Foreground"
              />
            </ControlSection>

            <ControlSection title="Accent Colors" expanded>
              <ColorPicker
                color={currentStyles.accent}
                onChange={(color) => updateStyle("accent", color)}
                label="Accent"
              />
              <ColorPicker
                color={currentStyles["accent-foreground"]}
                onChange={(color) => updateStyle("accent-foreground", color)}
                label="Accent Foreground"
              />
            </ControlSection>

            <ControlSection title="Base Colors">
              <ColorPicker
                color={currentStyles.background}
                onChange={(color) => updateStyle("background", color)}
                label="Background"
              />
              <ColorPicker
                color={currentStyles.foreground}
                onChange={(color) => updateStyle("foreground", color)}
                label="Foreground"
              />
            </ControlSection>

            <ControlSection title="Card Colors">
              <ColorPicker
                color={currentStyles.card}
                onChange={(color) => updateStyle("card", color)}
                label="Card Background"
              />
              <ColorPicker
                color={currentStyles["card-foreground"]}
                onChange={(color) => updateStyle("card-foreground", color)}
                label="Card Foreground"
              />
            </ControlSection>

            <ControlSection title="Popover Colors">
              <ColorPicker
                color={currentStyles.popover}
                onChange={(color) => updateStyle("popover", color)}
                label="Popover Background"
              />
              <ColorPicker
                color={currentStyles["popover-foreground"]}
                onChange={(color) => updateStyle("popover-foreground", color)}
                label="Popover Foreground"
              />
            </ControlSection>

            <ControlSection title="Muted Colors">
              <ColorPicker
                color={currentStyles.muted}
                onChange={(color) => updateStyle("muted", color)}
                label="Muted"
              />
              <ColorPicker
                color={currentStyles["muted-foreground"]}
                onChange={(color) => updateStyle("muted-foreground", color)}
                label="Muted Foreground"
              />
            </ControlSection>

            <ControlSection title="Destructive Colors">
              <ColorPicker
                color={currentStyles.destructive}
                onChange={(color) => updateStyle("destructive", color)}
                label="Destructive"
              />
              <ColorPicker
                color={currentStyles["destructive-foreground"]}
                onChange={(color) => updateStyle("destructive-foreground", color)}
                label="Destructive Foreground"
              />
            </ControlSection>

            <ControlSection title="Border & Input Colors">
              <ColorPicker
                color={currentStyles.border}
                onChange={(color) => updateStyle("border", color)}
                label="Border"
              />
              <ColorPicker
                color={currentStyles.input}
                onChange={(color) => updateStyle("input", color)}
                label="Input"
              />
              <ColorPicker
                color={currentStyles.ring}
                onChange={(color) => updateStyle("ring", color)}
                label="Ring"
              />
            </ControlSection>

            <ControlSection title="Chart Colors">
              <ColorPicker
                color={currentStyles["chart-1"]}
                onChange={(color) => updateStyle("chart-1", color)}
                label="Chart 1"
              />
              <ColorPicker
                color={currentStyles["chart-2"]}
                onChange={(color) => updateStyle("chart-2", color)}
                label="Chart 2"
              />
              <ColorPicker
                color={currentStyles["chart-3"]}
                onChange={(color) => updateStyle("chart-3", color)}
                label="Chart 3"
              />
              <ColorPicker
                color={currentStyles["chart-4"]}
                onChange={(color) => updateStyle("chart-4", color)}
                label="Chart 4"
              />
              <ColorPicker
                color={currentStyles["chart-5"]}
                onChange={(color) => updateStyle("chart-5", color)}
                label="Chart 5"
              />
            </ControlSection>

            <ControlSection title="Sidebar Colors">
              <ColorPicker
                color={currentStyles.sidebar}
                onChange={(color) => updateStyle("sidebar", color)}
                label="Sidebar Background"
              />
              <ColorPicker
                color={currentStyles["sidebar-foreground"]}
                onChange={(color) => updateStyle("sidebar-foreground", color)}
                label="Sidebar Foreground"
              />
              <ColorPicker
                color={currentStyles["sidebar-primary"]}
                onChange={(color) => updateStyle("sidebar-primary", color)}
                label="Sidebar Primary"
              />
              <ColorPicker
                color={currentStyles["sidebar-primary-foreground"]}
                onChange={(color) =>
                  updateStyle("sidebar-primary-foreground", color)
                }
                label="Sidebar Primary Foreground"
              />
              <ColorPicker
                color={currentStyles["sidebar-accent"]}
                onChange={(color) => updateStyle("sidebar-accent", color)}
                label="Sidebar Accent"
              />
              <ColorPicker
                color={currentStyles["sidebar-accent-foreground"]}
                onChange={(color) => updateStyle("sidebar-accent-foreground", color)}
                label="Sidebar Accent Foreground"
              />
              <ColorPicker
                color={currentStyles["sidebar-border"]}
                onChange={(color) => updateStyle("sidebar-border", color)}
                label="Sidebar Border"
              />
              <ColorPicker
                color={currentStyles["sidebar-ring"]}
                onChange={(color) => updateStyle("sidebar-ring", color)}
                label="Sidebar Ring"
              />
            </ControlSection>
          </TabsContent>

          <TabsContent value="typography" className="flex flex-col gap-4">
            <div className="p-3 bg-muted/50 rounded-md border mb-2 flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>
                  For custom fonts to work in your project, you'll need to embed
                  them. <br /> See{" "}
                  <a
                    href="https://tailwindcss.com/docs/font-family"
                    target="_blank"
                    className="underline underline-offset-2 hover:text-muted-foreground/90"
                  >
                    Tailwind docs
                  </a>{" "}
                  for more information.
                </p>
              </div>
            </div>

            <ControlSection title="Font Family" expanded>
              <div className="mb-4">
                <Label htmlFor="font-sans" className="text-xs mb-1.5 block">
                  Sans-Serif Font
                </Label>
                <ThemeFontSelect
                  fonts={{ ...sansSerifFonts, ...serifFonts, ...monoFonts }}
                  defaultValue={DEFAULT_FONT_SANS}
                  currentFont={getAppliedThemeFont(themeState, "font-sans")}
                  onFontChange={(value) => updateStyle("font-sans", value)}
                />
              </div>

              <Separator className="my-4" />

              <div className="mb-4">
                <Label htmlFor="font-serif" className="text-xs mb-1.5 block">
                  Serif Font
                </Label>
                <ThemeFontSelect
                  fonts={{ ...serifFonts, ...sansSerifFonts, ...monoFonts }}
                  defaultValue={DEFAULT_FONT_SERIF}
                  currentFont={getAppliedThemeFont(themeState, "font-serif")}
                  onFontChange={(value) => updateStyle("font-serif", value)}
                />
              </div>

              <Separator className="my-4" />
              <div>
                <Label htmlFor="font-mono" className="text-xs mb-1.5 block">
                  Monospace Font
                </Label>
                <ThemeFontSelect
                  fonts={{ ...monoFonts, ...sansSerifFonts, ...serifFonts }}
                  defaultValue={DEFAULT_FONT_MONO}
                  currentFont={getAppliedThemeFont(themeState, "font-mono")}
                  onFontChange={(value) => updateStyle("font-mono", value)}
                />
              </div>
            </ControlSection>
          </TabsContent>

          <TabsContent value="other">
            <SliderWithInput
              value={radius}
              onChange={(value) => updateStyle("radius", `${value}rem`)}
              min={0}
              max={5}
              step={0.025}
              unit="rem"
              label="Radius"
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ThemeControlPanel;
