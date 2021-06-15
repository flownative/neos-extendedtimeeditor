# Neos UI DateTime Editor with switchable timezone

This package provides a custom DateTime UI inspector editor `Flownative.Neos.ExtendedTimeEditor/DateTimeEditor`
with the following editor options:

<table>
  <tr>
    <th>Option</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>timezoneSupport</code></td>
    <td>Enables the timezone switch support, without enabling it, this editor will look and feel 
        very similar to the original one, apart from showing a timezone (maybe helpful with next option).
        <strong>This is only a display feature, the timezone is not stored,
        instead the entered time is converted and stored in UTC, therefore the absolute point in time selected
        in any timezone remains the same.</strong></td>
  </tr>
  <tr>
    <td><code>preferredTimezone</code></td>
    <td>Sets a timezone (eg. Europe/Berlin) as default display timezone. When timezone support is enabled, 
    editors can change to any other timezone they prefer to see. this option defaults to UTC internally.</td>
  </tr>
 </table>

